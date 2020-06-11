const helpers = require("./helpers.js");
const fs = require("fs");

module.exports = async function (command) {
  try {
    const qConfigPath = `${process.cwd()}/q.config.json`;
    if (fs.existsSync(qConfigPath)) {
      const qConfig = JSON.parse(fs.readFileSync(qConfigPath));
      const result = helpers.validateConfig(qConfig);
      if (result.isValid) {
        const config = await helpers.setupConfig(qConfig, command.clear);
        for (const item of qConfig.items) {
          await helpers.updateItem(item, config);
        }
      } else {
        console.log(result.errorsText);
        process.exit(1);
      }
    } else {
      console.log(
        "Couldn't find config file named q.config.json in the current diretory"
      );
    }
  } catch (error) {}
};
