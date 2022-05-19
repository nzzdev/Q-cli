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
      const validationResult = schemaService.validateConfig(
        qConfig,
        "copyItem"
      );

      if (validationResult.isValid) {
        const config = await configStore.setupStore(
          qConfig,
          command.environment,
          command.reset
        );

        for (const item of itemService.getItems(qConfig, command.environment)) {
          for (const environment of item.environments) {
            const qServer = config.get(`${environment.name}.qServer`);
            const accessToken = config.get(`${environment.name}.accessToken`);
            const cookie = config.get(`${environment.name}.cookie`);

            const existingItem = await itemService.getItem(
              qServer,
              environment,
              accessToken,
              cookie
            );

            delete existingItem.updatedBy;
            delete existingItem.createdBy;
            delete existingItem.createdDate;
            delete existingItem._id;
            delete existingItem._rev;

            let newItem = await itemService.createItem(
              existingItem,
              environment,
              config
            );
            // Save for success message
            const newItemId = newItem._id;
            const existingItemId = environment.id;

            const hasOverwrites =
              item.item &&
              Object.keys(item.item).length > 0 &&
              Object.getPrototypeOf(item.item) === Object.prototype;

            if (hasOverwrites) {
              environment.id = newItemId;

              newItem = await itemService.updateItem(
                item.item,
                environment,
                config,
                qConfigPath
              );
            }

            if (newItem) {
              console.log(
                successColor(
                  `Successfully copied item with id ${existingItemId} on ${environment.name} environment. Copied item id ${newItemId}`
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
