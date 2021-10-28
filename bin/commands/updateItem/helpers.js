const fetch = require("node-fetch");
const deepmerge = require("deepmerge");
const Ajv = require("ajv");
// Remove additional properties which are not defined by the json schema
// See https://ajv.js.org/options.html#removeadditional for details
const ajv = new Ajv({ schemaId: "auto", removeAdditional: true });
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
  const cookie = config.get(`${environment.name}.cookie`);
  const existingItem = await getItem(qServer, environment, accessToken, cookie);
  const updatedItem = await getUpdatedItem(
    qServer,
    accessToken,
    cookie,
    existingItem,
    item,
    environment,
    qConfigPath
  );
  return await saveItem(qServer, environment, accessToken, cookie, updatedItem);
}

async function getItem(qServer, environment, accessToken, cookie) {
  try {
    const response = await fetch(`${qServer}item/${environment.id}`, {
      headers: {
        "user-agent": "Q Command-line Tool",
        Authorization: `Bearer ${accessToken}`,
        Cookie: cookie ? cookie : "",
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
  cookie,
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
    // Removes additional properties not defined in the schema on the top level object of the item
    toolSchema.additionalProperties = false;
    // If options object is available additional properties not defined in the schema are removed
    if (toolSchema.properties && toolSchema.properties.options) {
      toolSchema.properties.options.additionalProperties = false;
    }
    const defaultItem = resourcesHelpers.getDefaultItem(toolSchema);
    item = JSON.parse(JSON.stringify(item));
    item = await resourcesHelpers.handleResources(
      qServer,
      accessToken,
      cookie,
      item,
      defaultItem,
      qConfigPath,
      environment
    );

    // Merge options:
    // File of files property will be updated (if file exists on destination)
    // If it doesn't exist it is appended to the files array
    // All other properties are overwritten from source config
    const options = {
      customMerge: (key) => {
        if (key === "files") {
          return (destArr, srcArr) => {
            if (destArr.length <= 0) {
              return srcArr;
            }

            srcArr.forEach((fileObj) => {
              let destIndex = destArr.findIndex(
                (destFileObj) =>
                  destFileObj.file.originalName === fileObj.file.originalName
              );

              if (destIndex !== -1) {
                destArr[destIndex] = fileObj;
              } else {
                destArr.push(fileObj);
              }
            });
            return destArr;
          };
        }
        return (destArr, srcArr) => srcArr;
      },
    };

    // merges existing item with the item defined in q.config.json
    const updatedItem = deepmerge(existingItem, item, options);
    // normalizes the item which removes additional properties not defined in the schema
    // and validates the item against the schema
    const normalizedItem = getNormalizedItem(
      toolSchema,
      updatedItem,
      environment
    );
    // the normalized item is merged with the existing item. This is done because properties such as _id and _rev
    // defined in the existing item are removed during normalization, because they are not defined in the schema
    return deepmerge(existingItem, normalizedItem, options);
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
}

async function saveItem(
  qServer,
  environment,
  accessToken,
  cookie,
  updatedItem
) {
  try {
    delete updatedItem.updatedDate;
    const response = await fetch(`${qServer}item`, {
      method: "PUT",
      body: JSON.stringify(updatedItem),
      headers: {
        "user-agent": "Q Command-line Tool",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Cookie: cookie ? cookie : "",
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

function getNormalizedItem(schema, item, environment) {
  const isValid = ajv.validate(schema, item);
  if (!isValid) {
    throw new Error(
      `A problem occured while validating item with id ${environment.id} on ${
        environment.name
      } environment: ${ajv.errorsText()}`
    );
  }

  return item;
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

async function setAuthenticationConfig(environment, qServer) {
  const result = await authenticate(environment, qServer);
  config.set(`${environment}.accessToken`, result.accessToken);
  config.set(`${environment}.cookie`, result.cookie);
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

    const qServer = config.get(`${environment}.qServer`);
    if (!config.get(`${environment}.accessToken`)) {
      await setAuthenticationConfig(environment, qServer);
    }

    const accessToken = config.get(`${environment}.accessToken`);
    const cookie = config.get(`${environment}.cookie`);
    const isAccessTokenValid = await checkValidityOfAccessToken(
      environment,
      qServer,
      accessToken,
      cookie
    );

    // Get a new access token in case its not valid anymore
    if (!isAccessTokenValid) {
      await setAuthenticationConfig(environment, qServer);
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
  const accessToken = process.env[`Q_${environmentPrefix}_ACCESSTOKEN`];
  const username = process.env[`Q_${environmentPrefix}_USERNAME`];
  const password = process.env[`Q_${environmentPrefix}_PASSWORD`];
  if (qServer && accessToken) {
    config.set(`${environment}.accessToken`, accessToken);
  } else if (qServer && username && password) {
    const cookie = config.get(`${environment}.cookie`);
    const result = await getAccessToken(
      environment,
      qServer,
      username,
      password,
      cookie
    );

    if (!result) {
      console.error(
        errorColor(
          `A problem occured while authenticating to the ${environment} environment using environment variables. Please check your credentials and try again.`
        )
      );
      process.exit(1);
    }

    config.set(`${environment}.accessToken`, result.accessToken);
    config.set(`${environment}.cookie`, result.cookie);
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

  const cookie = config.get(`${environment}.cookie`);
  let result = await getAccessToken(
    environment,
    qServer,
    username,
    password,
    cookie
  );

  while (!result) {
    console.error(
      errorColor(
        "A problem occured while authenticating. Please check your credentials and try again."
      )
    );

    result = await authenticate(environment, qServer);

    if (result.accessToken) {
      break;
    }
  }

  return result;
}

async function getAccessToken(
  environment,
  qServer,
  username,
  password,
  cookie
) {
  try {
    const response = await fetch(`${qServer}authenticate`, {
      method: "POST",
      headers: {
        "user-agent": "Q Command-line Tool",
        origin: qServer,
        Cookie: cookie ? cookie : "",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      const body = await response.json();
      return {
        accessToken: body.access_token,
        cookie: response.headers.get("set-cookie"),
      };
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

async function checkValidityOfAccessToken(
  environment,
  qServer,
  accessToken,
  cookie
) {
  try {
    const response = await fetch(`${qServer}user`, {
      headers: {
        "user-agent": "Q Command-line Tool",
        Authorization: `Bearer ${accessToken}`,
        Cookie: cookie ? cookie : "",
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
