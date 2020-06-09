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
}

module.exports = async function () {
  try {
    if (!config.get("QServerBaseUrl")) {
      const QServerBaseUrl = await promptly.prompt("Enter the Q-Server url: ");
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
        username,
        password.trim()
      );
      config.set("QServerAccessToken", QServerAccessToken);
    }

    const QServerAccessToken = config.get("QServerAccessToken");
    const QServerBaseUrl = config.get("QServerBaseUrl");
    //await helpers.checkValidityOfAccessToken(QServerBaseUrl, QServerAccessToken);

    const QConfigPath = `${process.cwd()}/q.config.json`;
    if (fs.existsSync(QConfigPath)) {
      const qConfig = JSON.parse(fs.readFileSync(QConfigPath));
      if (qConfig.items) {
        for (const item of qConfig.items) {
          await updateItem(QServerBaseUrl, QServerAccessToken, item);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
