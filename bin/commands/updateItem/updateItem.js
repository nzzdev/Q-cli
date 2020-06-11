const helpers = require("./helpers.js");
const fs = require("fs");

module.exports = async function (command) {
  try {
    if (fs.existsSync(command.config)) {
      const qConfig = JSON.parse(fs.readFileSync(command.config));
      const validationResult = helpers.validateConfig(qConfig);
      if (validationResult.isValid) {
        const config = await helpers.setupConfig(qConfig, command.reset);
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
        "Couldn't find config file named q.config.json in the current directory. Create a config file in the current directory or pass the path to the config file with the option -c <path>"
      );
    }
  } catch (error) {}
};
