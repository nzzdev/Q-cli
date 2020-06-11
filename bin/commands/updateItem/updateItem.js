const helpers = require("./helpers.js");
const fs = require("fs");

module.exports = async function (command) {
  try {
    const qConfigPath = `${process.cwd()}/q.config.json`;
    if (fs.existsSync(qConfigPath)) {
      const qConfig = JSON.parse(fs.readFileSync(qConfigPath));
      const validationResult = helpers.validateConfig(qConfig);
      if (validationResult.isValid) {
        const config = await helpers.setupConfig(qConfig, command.clear);
        for (const item of qConfig.items) {
          const result = await helpers.updateItem(item, config);
          if (result) {
            console.log(
              `Successfully updated item with id ${item.metadata.id} on ${item.metadata.environment} environment`
            );
          }
        }
      } else {
        console.log(
          `A problem occured while validating the config file: ${validationResult.errorsText}`
        );
        process.exit(1);
      }
    } else {
      console.log(
        "Couldn't find config file named q.config.json in the current directory"
      );
    }
  } catch (error) {}
};
