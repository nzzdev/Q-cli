const helpers = require("./helpers.js");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const errorColor = chalk.red;
const successColor = chalk.green;

module.exports = async function (command) {
  try {
    const qConfigPath = path.resolve(command.config);
    if (fs.existsSync(qConfigPath)) {
      const qConfig = JSON.parse(fs.readFileSync(qConfigPath));
      const validationResult = helpers.validateConfig(qConfig);
      if (validationResult.isValid) {
        const config = await helpers.setupConfig(
          qConfig,
          command.environment,
          command.reset
        );
        for (const item of helpers.getItems(qConfig, command.environment)) {
          for (const environment of item.metadata.environments) {
            const result = await helpers.updateItem(
              item.item,
              environment,
              config,
              qConfigPath
            );
            if (result) {
              console.log(
                successColor(
                  `Successfully updated item with id ${environment.id} on ${environment.environment} environment`
                )
              );
            }
          }
        }
      } else {
        console.error(
          errorColor(
            `A problem occured while validating the config file: ${validationResult.errorsText}`
          )
        );
        process.exit(1);
      }
    } else {
      console.error(
        errorColor(
          "Couldn't find config file named q.config.json in the current directory. Create a config file in the current directory or pass the path to the config file with the option -c <path>"
        )
      );
    }
  } catch (error) {}
};
