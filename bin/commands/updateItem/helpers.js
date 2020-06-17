const fetch = require("node-fetch");
const deepmerge = require("deepmerge");
const Ajv = require("ajv");
const ajv = new Ajv({ schemaId: "auto" });
ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-04.json"));
const promptly = require("promptly");
const chalk = require("chalk");
const errorColor = chalk.red;
const Configstore = require("configstore");
const package = require("../../../package.json");
const config = new Configstore(package.name, {});
const resourcesHelpers = require("./resourcesHelpers.js");

async function updateItem(item, config) {
  const qServer = config.get(`${item.metadata.environment}.qServer`);
  const accessToken = config.get(`${item.metadata.environment}.accessToken`);
  const existingItem = await getItem(qServer, accessToken, item.metadata.id);
  const updatedItem = await getUpdatedItem(
    qServer,
    accessToken,
    existingItem,
    item
  );
  return await saveItem(qServer, accessToken, updatedItem);
}

async function getItem(qServer, accessToken, id) {
  try {
    const response = await fetch(`${qServer}item/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        `A problem occured while getting item with id ${item.metadata.id} on ${item.metadata.environment} environment. Please check your connection and try again.`
      );
    }
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
}

async function getUpdatedItem(qServer, accessToken, existingItem, item) {
  try {
    const toolSchema = await resourcesHelpers.getToolSchema(
      qServer,
      item.metadata.tool
    );
    const defaultItem = resourcesHelpers.getDefaultItem(toolSchema);
    item.item = await resourcesHelpers.handleResources(
      qServer,
      accessToken,
      item.item,
      defaultItem
    );

    const updatedItem = deepmerge(existingItem, item.item, {
      arrayMerge: (destArr, srcArr) => srcArr,
    });

    const validationResult = validateItem(toolSchema, updatedItem);
    if (validationResult.isValid) {
      return updatedItem;
    } else {
      throw new Error(
        `A problem occured while validating item with id ${item.metadata.id} on ${item.metadata.environment} environment: ${validationResult.errorsText}`
      );
    }
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
}

async function saveItem(qServer, accessToken, item) {
  try {
    delete item.updatedDate;
    const response = await fetch(`${qServer}item`, {
      method: "PUT",
      body: JSON.stringify(item),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        `A problem occured while saving item with id ${item.metadata.id} on ${item.metadata.environment} environment. Please check your connection and try again.`
      );
    }
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
}

function getItems(qConfig, environment) {
  const items = qConfig.items.filter((item) => {
    if (environment) {
      return item.metadata.environment === environment;
    }

    return true;
  });

  return items;
}

function validateConfig(config) {
  const isValid = ajv.validate(require("./schema.json"), config);
  return {
    isValid: isValid,
    errorsText: ajv.errorsText(),
  };
}

function validateItem(schema, item) {
  const isValid = ajv.validate(schema, item);
  return {
    isValid: isValid,
    errorsText: ajv.errorsText(),
  };
}

function getEnvironments(qConfig, environment) {
  const environments = new Set();
  for (const item of qConfig.items) {
    if (environment) {
      if (environment === item.metadata.environment) {
        environments.add(item.metadata.environment);
      }
    } else {
      environments.add(item.metadata.environment);
    }
  }

  return Array.from(environments);
}

async function setupConfig(qConfig, environmentFilter, reset) {
  if (reset) {
    config.clear();
  }
  for (const environment of getEnvironments(qConfig, environmentFilter)) {
    if (!config.get(`${environment}.qServer`)) {
      const qServer = await promptly.prompt(
        `Enter the Q-Server url for ${environment} environment: `,
        {
          validator: (qServer) => {
            return new URL(qServer).toString();
          },
          retry: true,
        }
      );
      config.set(`${environment}.qServer`, qServer);
    }

    if (!config.get(`${environment}.accessToken`)) {
      const qServer = config.get(`${environment}.qServer`);
      const accessToken = await authenticate(environment, qServer);
      config.set(`${environment}.accessToken`, accessToken);
    }

    const accessToken = config.get(`${environment}.accessToken`);
    const qServer = config.get(`${environment}.qServer`);
    const isAccessTokenValid = await checkValidityOfAccessToken(
      environment,
      qServer,
      accessToken
    );

    // Get a new access token in case its not valid anymore
    if (!isAccessTokenValid) {
      const qServer = config.get(`${environment}.qServer`);
      const accessToken = await authenticate(environment, qServer);
      config.set(`${environment}.accessToken`, accessToken);
    }
  }

  return config;
}

async function authenticate(environment, qServer) {
  const username = await promptly.prompt(
    `Enter your username on ${environment} environment: `,
    { validator: (username) => username.trim() }
  );
  const password = await promptly.password(
    `Enter your password on ${environment} environment: `,
    {
      validator: async (password) => password.trim(),
      replace: "*",
    }
  );

  let accessToken = await getAccessToken(
    environment,
    qServer,
    username,
    password
  );

  while (!accessToken) {
    console.error(
      errorColor(
        "A problem occured while authenticating. Please check your credentials and try again."
      )
    );
    accessToken = await authenticate(environment, qServer);

    if (accessToken) {
      break;
    }
  }

  return accessToken;
}

async function getAccessToken(environment, qServer, username, password) {
  try {
    const response = await fetch(`${qServer}authenticate`, {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    if (response.ok) {
      const body = await response.json();
      return body.access_token;
    }
    return false;
  } catch (error) {
    console.error(
      errorColor(
        `A problem occured while authenticating on ${environment} environment. Please check your connection and try again.`
      )
    );
    process.exit(1);
  }
}

async function checkValidityOfAccessToken(environment, qServer, accessToken) {
  try {
    const response = await fetch(`${qServer}user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error(
      errorColor(
        `A problem occured while checking the validity of your access token on ${environment} environment. Please check your connection and try again.`
      )
    );
    process.exit(1);
  }
}

module.exports = {
  updateItem: updateItem,
  setupConfig: setupConfig,
  getItems: getItems,
  validateConfig: validateConfig,
};
