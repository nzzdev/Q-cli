const schemaService = require('../schemaService.js');
const configStore = require('../configStore.js');
const itemService = require('../itemService.js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const errorColor = chalk.red;
const successColor = chalk.green;

module.exports = async function (command) {
  try {
    const qConfigPath = path.resolve(command.config);

    if (!fs.existsSync(qConfigPath)) {
      console.error(
        errorColor(
          "Couldn't find config file named q.config.json in the current directory. Create a config file in the current directory or pass the path to the config file with the option -c <path>"
        )
      );
      process.exit(1);
    }

    const qConfig = JSON.parse(fs.readFileSync(qConfigPath));
    const validationResult = schemaService.validateConfig(qConfig, 'createCustomCodeItem');

    if (!validationResult.isValid) {
      console.error(errorColor(`A problem occured while validating the config file: ${validationResult.errorsText}`));
      process.exit(1);
    }

    const environmentName = command.environment;
    const config = await configStore.setupStore(qConfig, environmentName, command.reset);
    const items = itemService.getItems(qConfig);
    const firstItem = items?.[0];

    if (!firstItem) {
      console.error(errorColor('No items found in the config file.'));
      process.exit(1);
    }

    // Create a new custom code item
    const title = command.title || 'Custom Code item created by Q-cli';
    const newItem = await itemService.createItem(
      { assetGroups: [], data: [], files: [], title: title, tool: 'custom_code' },
      { name: environmentName },
      config
    );

    if (!newItem) {
      console.error(errorColor('Failed to create a new custom code item.'));
      process.exit(1);
    }

    // Add the new custom code item to the config file
    qConfig.items[0].environments.push({
      id: newItem._id,
      name: environmentName,
    });

    // Write the updated config file
    fs.writeFileSync(qConfigPath, JSON.stringify(qConfig, null, 2));

    console.log(
      successColor(`Successfully added new custom code item with id ${newItem._id} on ${environmentName} environment.`)
    );
  } catch (error) {
    console.error(errorColor(`A problem occured while parsing the config file at ${command.config}.`));
    console.error(error);
  }
};
