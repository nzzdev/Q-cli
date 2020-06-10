const fetch = require("node-fetch");
const deepmerge = require("deepmerge");
const path = require("path");
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

  await saveItem(qServer, accessToken, newItem);
  console.log(
    `Successfully updated item with id ${item.metadata.id} on ${item.metadata.environment} environment`
  );
}

async function getItem(qServer, accessToken, id) {
  const response = await fetch(`${qServer}item/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    logUnexpectedError();
  }
}

async function saveItem(qServer, accessToken, item) {
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
    logUnexpectedError();
  }
}

function logUnexpectedError(error) {
  console.log(
    "An unexpected error occured. Please check the entered information and try again."
  );
  console.log(JSON.stringify(error));
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
      const qServer = new URL(
        await promptly.prompt(
          `Enter the Q-Server url for ${environment} environment: `
        )
      ).toString();
      config.set(`${environment}.qServer`, qServer);
    }

    if (!config.get(`${environment}.accessToken`)) {
      const qServer = config.get(`${environment}.qServer`);
      const username = await promptly.prompt(
        `Enter your username on ${environment} environment: `
      );
      const password = await promptly.password(
        `Enter your password on ${environment} environment: `,
        {
          replace: "*",
        }
      );
      const accessToken = await getAccessToken(
        qServer,
        username.trim(),
        password.trim()
      );
      config.set(`${environment}.accessToken`, accessToken);
    }

    const accessToken = config.get(`${environment}.accessToken`);
    const qServer = config.get(`${environment}.qServer`);
    const isAccessTokenValid = await checkValidityOfAccessToken(
      qServer,
      accessToken
    );

    // Get a new access token in case its not valid anymore
    if (!isAccessTokenValid) {
      const username = await promptly.prompt("Enter your username: ");
      const password = await promptly.password("Enter your password: ", {
        replace: "*",
      });
      const accessToken = await getAccessToken(
        qServer,
        username,
        password.trim()
      );
      config.set(`${environment}.accessToken`, accessToken);
    }
  }

  return config;
}

async function getAccessToken(qServer, username, password) {
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
  } else {
    logUnexpectedError();
  }
}

async function checkValidityOfAccessToken(qServer, accessToken) {
  const response = await fetch(`${qServer}user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.ok;
}

module.exports = {
  updateItem: updateItem,
  setupConfig: setupConfig,
  validateConfig: validateConfig,
};
