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

async function updateItem(item, environment, config, qConfigPath) {
  const qServer = config.get(`${environment.name}.qServer`);
  const accessToken = config.get(`${environment.name}.accessToken`);
  const existingItem = await getItem(qServer, accessToken, environment);
  const updatedItem = await getUpdatedItem(
    qServer,
    accessToken,
    existingItem,
    item,
    environment,
    qConfigPath
  );
  return await saveItem(qServer, accessToken, updatedItem, environment);
}

async function getItem(qServer, accessToken, environment) {
  try {
    const response = await fetch(`${qServer}item/${environment.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        `A problem occured while getting item with id ${environment.id} on ${environment.name} environment. Please make sure that the id is correct, you have an internet connection and try again.`
      );
    }
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
}

async function getUpdatedItem(
  qServer,
  accessToken,
  existingItem,
  item,
  environment,
  qConfigPath
) {
  try {
    const toolSchema = await resourcesHelpers.getToolSchema(
      qServer,
      existingItem.tool
    );
    const defaultItem = resourcesHelpers.getDefaultItem(toolSchema);
    item = JSON.parse(JSON.stringify(item));
    item = await resourcesHelpers.handleResources(
      qServer,
      accessToken,
      item,
      defaultItem,
      qConfigPath,
      environment
    );

    const updatedItem = deepmerge(existingItem, item, {
      arrayMerge: (destArr, srcArr) => srcArr,
    });

    const validationResult = validateItem(toolSchema, updatedItem);
    if (validationResult.isValid) {
      return updatedItem;
    } else {
      throw new Error(
        `A problem occured while validating item with id ${environment.id} on ${environment.name} environment: ${validationResult.errorsText}`
      );
    }
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
}

async function saveItem(qServer, accessToken, updatedItem, environment) {
  try {
    delete updatedItem.updatedDate;
    const response = await fetch(`${qServer}item`, {
      method: "PUT",
      body: JSON.stringify(updatedItem),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        `A problem occured while saving item with id ${environment.id} on ${environment.name} environment. Please check your connection and try again.`
      );
    }
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
}

function getItems(qConfig, environmentFilter) {
  const items = qConfig.items
    .filter((item) => {
      if (environmentFilter) {
        return item.environments.some(
          (environment) => environment.name === environmentFilter
        );
      }

      return true;
    })
    .map((item) => {
      if (environmentFilter) {
        item.environments = item.environments.filter(
          (environment) => environment.name === environmentFilter
        );
      }

      return item;
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

function getEnvironments(qConfig, environmentFilter) {
  try {
    const environments = new Set();
    for (const item of qConfig.items) {
      for (const environment of item.environments) {
        if (environmentFilter) {
          if (environmentFilter === environment.name) {
            environments.add(environment.name);
          }
        } else {
          environments.add(environment.name);
        }
      }
    }

    if (environments.size > 0) {
      return Array.from(environments);
    } else {
      throw new Error(
        `No items with environment ${environmentFilter} found. Please check your configuration and try again.`
      );
    }
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
}

async function setupConfig(qConfig, environmentFilter, reset) {
  if (reset) {
    config.clear();
  }
  for (const environment of getEnvironments(qConfig, environmentFilter)) {
    await setupConfigFromEnvVars(environment);

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

async function setupConfigFromEnvVars(environment) {
  const environmentPrefix = environment.toUpperCase();

  const qServer = process.env[`Q_${environmentPrefix}_SERVER`];
  if (qServer) {
    config.set(`${environment}.qServer`, qServer);
  }
  const username = process.env[`Q_${environmentPrefix}_USERNAME`];
  const password = process.env[`Q_${environmentPrefix}_PASSWORD`];
  if (qServer && username && password) {
    const accessToken = await getAccessToken(
      environment,
      qServer,
      username,
      password
    );

    if (!accessToken) {
      console.error(
        errorColor(
          `A problem occured while authenticating to the ${environment} environment using environment variables. Please check your credentials and try again.`
        )
      );
      process.exit(1);
    }

    config.set(`${environment}.accessToken`, accessToken);
  }
}

async function authenticate(environment, qServer) {
  let username = config.get(`${environment}.username`);
  if (!username) {
    username = await promptly.prompt(
      `Enter your username on ${environment} environment: `,
      { validator: (username) => username.trim() }
    );
    config.set(`${environment}.username`, username);
  }

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
      header: {
        "user-agent": "Q Command-line Tool",
        origin: qServer,
      },
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
