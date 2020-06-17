const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
const util = require("util");
const stat = util.promisify(fs.stat);
const Mimos = require("@hapi/mimos");
const mimos = new Mimos({
  override: {
    "application/javascript": {
      source: "iana",
      charset: "UTF-8",
      compressible: true,
      extensions: ["js", "javascript"],
      type: "text/javascript",
    },
  },
});
const imageSize = require("image-size");
const path = require("path");
const chalk = require("chalk");
const errorColor = chalk.red;

async function getToolSchema(qServer, tool) {
  try {
    const response = await fetch(`${qServer}tools/${tool}/schema.json`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(
        `A problem occured while getting the schema of the ${tool} tool. Please check your connection and try again.`
      );
    }
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
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
    if (defaultValue !== null) {
      array = defaultValue;
    }
    return array;
  } else if (schema.type === "object") {
    const defaultValue = getDefaultOrNull(schema);
    if (defaultValue !== null) {
      return defaultValue;
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

async function uploadResource(qServer, accessToken, resourcePath) {
  try {
    if (fs.existsSync(resourcePath)) {
      const form = new FormData();
      const stream = fs.createReadStream(resourcePath);
      form.append("file", stream);
      const headers = form.getHeaders();
      headers.Authorization = `Bearer ${accessToken}`;

      const response = await fetch(`${qServer}file`, {
        method: "POST",
        headers: headers,
        body: form,
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(
          `Error occured while uploading the resource at ${resourcePath}. Please check your connection and try again.`
        );
      }
    } else {
      throw new Error(
        `Error occured while reading the resource at ${resourcePath}. Please make sure that the resource exists and try again.`
      );
    }
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
}

async function handleResources(
  qServer,
  accessToken,
  item,
  defaultItem,
  searchKey
) {
  for (let key of Object.keys(item)) {
    if (typeof item[key] === "object") {
      let defaultItemSubtree;
      if (defaultItem && Number.isInteger(parseInt(key)) && key > 0) {
        defaultItemSubtree = defaultItem[0];
      } else if (defaultItem && defaultItem[key]) {
        defaultItemSubtree = defaultItem[key];
      }
      item[key] = await handleResources(
        qServer,
        accessToken,
        item[key],
        defaultItemSubtree,
        searchKey
      );
    } else if (key === searchKey) {
      item = await handleResource(qServer, accessToken, item[key], defaultItem);
    }
  }

  return item;
}

async function handleResource(qServer, accessToken, resource, defaultProps) {
  const resourcePath = path.resolve(process.cwd(), resource);
  resource = await uploadResource(qServer, accessToken, resourcePath);
  const statistic = await stat(resourcePath);
  resource.size = statistic.size;
  resource.type = mimos.path(resourcePath).type;

  if (defaultProps.name) {
    resource[defaultProps.name] = path.basename(resourcePath);
  }
  if (defaultProps.width && defaultProps.height) {
    const dimensions = imageSize(resourcePath);
    resource[defaultProps.width] = dimensions.width;
    resource[defaultProps.height] = dimensions.height;
  }

  return resource;
}

module.exports = {
  handleResources: handleResources,
  getDefaultItem: getDefaultItem,
  getToolSchema: getToolSchema,
};
