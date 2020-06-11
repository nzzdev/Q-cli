const fetch = require("node-fetch");
const deepmerge = require("deepmerge");
const Ajv = require("ajv");
const ajv = new Ajv();
const promptly = require("promptly");
const Configstore = require("configstore");
const package = require("../../../package.json");
const config = new Configstore(package.name, {});

async function updateItem(item, config) {
  const qServer = config.get(`${item.metadata.environment}.qServer`);
  const accessToken = config.get(`${item.metadata.environment}.accessToken`);
  const existingItem = await getItem(qServer, accessToken, item.metadata.id);
  const newItem = deepmerge(existingItem, item.item, {
    arrayMerge: (destArr, srcArr) => srcArr,
  });
  return await saveItem(qServer, accessToken, newItem);
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
    console.log(error.message);
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
    console.log(error.message);
    process.exit(1);
  }
}

function validateConfig(config) {
  const isValid = ajv.validate(require("./schema.json"), config);
  return {
    isValid: isValid,
    errorsText: ajv.errorsText(),
  };
}

function getEnvironments(qConfig) {
  const environments = new Set();
  for (const item of qConfig.items) {
    environments.add(item.metadata.environment);
  }

  return Array.from(environments);
}

async function setupConfig(qConfig, clearConfig) {
  if (clearConfig) {
    config.clear();
  }
  const environments = getEnvironments(qConfig);
  for (const environment of environments) {
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
    console.log(
      "A problem occured while authenticating. Please check your credentials and try again."
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
    console.log(
      `A problem occured while authenticating on ${environment} environment. Please check your connection and try again.`
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
    console.log(
      `A problem occured while checking the validity of your access token on ${environment} environment. Please check your connection and try again.`
    );
    process.exit(1);
  }
}

module.exports = {
  updateItem: updateItem,
  setupConfig: setupConfig,
  validateConfig: validateConfig,
};
