const promptly = require("promptly");
const Configstore = require("configstore");
const deepmerge = require("deepmerge");
const package = require("../../../package.json");
const config = new Configstore(package.name, {});
const helpers = require("./helpers.js");
const fs = require("fs");

async function updateItem(QServerBaseUrl, QServerAccessToken, item) {
  const existingItem = await helpers.getItem(
    QServerBaseUrl,
    QServerAccessToken,
    item.metadata.id
  );
  const newItem = deepmerge(existingItem, item.item, {
    arrayMerge: (destArr, srcArr) => srcArr,
  });

  await helpers.saveItem(QServerBaseUrl, QServerAccessToken, newItem);
  console.log(`Successfully updated item with id ${item.metadata.id}`);
}

module.exports = async function (command) {
  try {
    if (command.clear) {
      config.clear();
    }

    if (!config.get("QServerBaseUrl")) {
      const QServerBaseUrl = new URL(
        await promptly.prompt("Enter the Q-Server url: ")
      ).toString();
      config.set("QServerBaseUrl", QServerBaseUrl);
    }

    if (!config.get("QServerAccessToken")) {
      const QServerBaseUrl = config.get("QServerBaseUrl");
      const username = await promptly.prompt("Enter your username: ");
      const password = await promptly.password("Enter your password: ", {
        replace: "*",
      });
      const QServerAccessToken = await helpers.getQServerAccessToken(
        QServerBaseUrl,
        username.trim(),
        password.trim()
      );
      config.set("QServerAccessToken", QServerAccessToken);
    }

    const QServerAccessToken = config.get("QServerAccessToken");
    const QServerBaseUrl = config.get("QServerBaseUrl");
    const isAccessTokenValid = await helpers.checkValidityOfAccessToken(
      QServerBaseUrl,
      QServerAccessToken
    );

    // Get a new access token in case its not valid anymore
    if (!isAccessTokenValid) {
      const username = await promptly.prompt("Enter your username: ");
      const password = await promptly.password("Enter your password: ", {
        replace: "*",
      });
      const QServerAccessToken = await helpers.getQServerAccessToken(
        QServerBaseUrl,
        username,
        password.trim()
      );
      config.set("QServerAccessToken", QServerAccessToken);
    }

    const QConfigPath = `${process.cwd()}/q.config.json`;
    if (fs.existsSync(QConfigPath)) {
      const qConfig = JSON.parse(fs.readFileSync(QConfigPath));
      const isValidConfig = helpers.validateConfig(qConfig);
      if (isValidConfig) {
        for (const item of qConfig.items) {
          await updateItem(QServerBaseUrl, QServerAccessToken, item);
        }
      }
    } else {
      console.log(
        "Couldn't find config file named q.config.json in the current diretory"
      );
    }
  } catch (error) {
    console.log(
      "An unexpected error occured. Please check the entered information and try again."
    );
    console.log(JSON.stringify(error));
  }
};
