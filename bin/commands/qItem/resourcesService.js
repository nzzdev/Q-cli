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

// Recursively traverses the item object
// If a property called "path" is found, the resource is uploaded
// and the metadata of that resource is inserted at that place in the item object
async function handleResources(
  qServer,
  accessToken,
  cookie,
  item,
  defaultItem,
  qConfigPath,
  environment
) {
  try {
    if (item) {
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
            cookie,
            item[key],
            defaultItemSubtree,
            qConfigPath,
            environment
          );
        } else if (key === "path") {
          const resourcePath = item[key];
          if (defaultItem) {
            item = await getResourceMetadata(
              qServer,
              accessToken,
              cookie,
              resourcePath,
              defaultItem,
              qConfigPath,
              environment
            );
          } else {
            throw new Error(
              `Error occured while uploading the resource at ${resourcePath}. Please make sure the config structure matches the schema of the tool and try again. `
            );
          }
        }
      }
    }
    return item;
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
}

// Uploads the resource and returns the metadata based on the file properties
async function getResourceMetadata(
  qServer,
  accessToken,
  cookie,
  resource,
  fileProperties,
  qConfigPath,
  environment
) {
  const resourcePath = path
    .resolve(path.dirname(qConfigPath), resource)
    .replace(/{id}/g, environment.id);
  resource = await uploadResource(qServer, accessToken, cookie, resourcePath);
  const statistic = await stat(resourcePath);
  resource.size = statistic.size;
  resource.type = mimos.path(resourcePath).type;

  if (fileProperties.name) {
    resource[fileProperties.name] = path.basename(resourcePath);
  }
  if (fileProperties.width && fileProperties.height) {
    const dimensions = imageSize(resourcePath);
    resource[fileProperties.width] = dimensions.width;
    resource[fileProperties.height] = dimensions.height;
  }

  return resource;
}

async function uploadResource(qServer, accessToken, cookie, resourcePath) {
  try {
    if (fs.existsSync(resourcePath)) {
      const form = new FormData();
      const stream = fs.createReadStream(resourcePath);
      form.append("file", stream);
      const headers = form.getHeaders();
      headers.Authorization = `Bearer ${accessToken}`;
      headers.Cookie = cookie;

      const response = await fetch(`${qServer}file`, {
        method: "POST",
        headers: headers,
        body: form,
      });
      const body = await response.json();

      if (response.ok) {
        return body;
      } else {
        throw new Error(
          `Error occured while uploading the resource at ${resourcePath}. Please check your connection and try again.\nResponse: ${body.statusCode} ${body.error} - ${body.message}`
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

module.exports = {
  handleResources: handleResources,
};
