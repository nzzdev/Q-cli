const schemaService = require("./../schemaService.js");
const configStore = require("./../configStore.js");
const itemService = require("./../itemService.js");
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
      const validationResult = schemaService.validateConfig(qConfig);

      if (validationResult.isValid) {
        const config = await configStore.setupStore(
          qConfig,
          command.environment,
          command.reset
        );

        for (const item of itemService.getItems(qConfig, command.environment)) {
          for (const environment of item.environments) {
            const result = await itemService.updateItem(
              item.item,
              environment,
              config,
              qConfigPath
            );

            if (result) {
              console.log(
                successColor(
                  `Successfully updated item with id ${environment.id} on ${environment.name} environment`
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
  } catch (error) {
    console.error(
      errorColor(
        `A problem occured while parsing the config file at ${command.config}. Please make sure it is valid JSON.`
      )
    );
  }
};
