const resourcesService = require("./resourcesService.js");
const schemaService = require("./schemaService.js");
const deepmerge = require("deepmerge");
const fetch = require("node-fetch");
const chalk = require("chalk");
const errorColor = chalk.red;

async function createItem(item, environment, config) {
  const qServer = config.get(`${environment.name}.qServer`);
  const accessToken = config.get(`${environment.name}.accessToken`);
  const cookie = config.get(`${environment.name}.cookie`);

  try {
    const response = await fetch(`${qServer}item`, {
      method: "POST",
      body: JSON.stringify(item),
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
        `A problem occured while creating item on ${environment.name} environment. Please check your connection and try again.`
      );
    }
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
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

function getDefaultOrNull(schema) {
  if (schema.hasOwnProperty("default")) {
    if (typeof schema.default === "object") {
      return JSON.parse(JSON.stringify(schema.default));
    }
    return schema.default;
  }
  return null;
}

// Returns a default item based on the tool schema
// The default item is used to derive the file properties of a certain file type
// These file properties are specified by the tool and are specific to the file type
// For example an image file has height/width file properties
function getDefaultItem(schema) {
  schema = JSON.parse(JSON.stringify(schema));
  if (schema.type === "array") {
    let array = [];
    schema.minItems = 1;
    for (let i = 0; i < schema.minItems; i++) {
      let value = getDefaultItem(schema.items);
      if (value) {
        if (
          schema["Q:type"] &&
          schema["Q:type"] === "files" &&
          schema["Q:options"] &&
          schema["Q:options"].fileProperties
        ) {
          array.push(Object.assign(value, schema["Q:options"].fileProperties));
        } else {
          array.push(value);
        }
      }
    }

    const defaultValue = getDefaultOrNull(schema);
    if (array === null && defaultValue !== null) {
      array = defaultValue;
    }
    return array;
  } else if (schema.type === "object") {
    const defaultValue = getDefaultOrNull(schema);
    if (defaultValue !== null) {
      return defaultValue;
    }

    if (
      schema["Q:type"] &&
      schema["Q:type"] === "files" &&
      schema["Q:options"] &&
      schema["Q:options"].fileProperties
    ) {
      return schema["Q:options"].fileProperties;
    }

    if (!schema.hasOwnProperty("properties")) {
      return undefined;
    }
    let object = {};
    Object.keys(schema.properties).forEach((propertyName) => {
      const property = schema.properties[propertyName];
      let value = getDefaultItem(property);
      if (value !== undefined) {
        object[propertyName] = value;
      } else if (
        property["Q:type"] &&
        property["Q:type"] === "files" &&
        property["Q:options"] &&
        property["Q:options"].fileProperties
      ) {
        object[propertyName] = property["Q:options"].fileProperties;
      }
    });
    return object;
  }

  // if this is not an array or object, we just get the default if any
  const defaultValue = getDefaultOrNull(schema);
  if (defaultValue !== null) {
    return defaultValue;
  }
  return undefined;
}

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
    const toolSchema = await schemaService.getToolSchema(
      qServer,
      existingItem.tool
    );
    // Removes additional properties not defined in the schema on the top level object of the item
    toolSchema.additionalProperties = false;
    // If options object is available additional properties not defined in the schema are removed
    if (toolSchema.properties && toolSchema.properties.options) {
      toolSchema.properties.options.additionalProperties = false;
    }
    const defaultItem = getDefaultItem(toolSchema);
    item = JSON.parse(JSON.stringify(item));
    item = await resourcesService.handleResources(
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
      arrayMerge: (destArr, srcArr) => srcArr,
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
      },
    };

    // merges existing item with the item defined in q.config.json
    const updatedItem = deepmerge(existingItem, item, options);
    // normalizes the item which removes additional properties not defined in the schema
    // and validates the item against the schema
    const normalizedItem = schemaService.getNormalizedItem(
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

module.exports = {
  createItem: createItem,
  getItem: getItem,
  getItems: getItems,
  updateItem: updateItem,
};
