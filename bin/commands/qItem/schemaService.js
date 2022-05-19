const Ajv = require("ajv");
// Remove additional properties which are not defined by the json schema
// See https://ajv.js.org/options.html#removeadditional for details
const ajv = new Ajv({ schemaId: "auto", removeAdditional: true });
ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-04.json"));
const fetch = require("node-fetch");
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

function getSchemaPathFor(commandName) {
  const pathFor = {
    copyItem: "./copyItem/copySchema.json",
    updateItem: "./updateItem/updateSchema.json",
  };

  if (pathFor[commandName]) {
    return pathFor[commandName];
  } else {
    throw new Error(`Unhandled schema path for commandName: '${commandName}'`);
  }
}

function validateConfig(config, commandName = "updateItem") {
  const isValid = ajv.validate(require(getSchemaPathFor(commandName)), config);
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

module.exports = {
  getToolSchema: getToolSchema,
  validateConfig: validateConfig,
  getNormalizedItem: getNormalizedItem,
};
