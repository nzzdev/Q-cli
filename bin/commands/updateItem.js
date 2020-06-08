const Configstore = require("configstore");
const package = require("../../package.json");

// Create a Configstore instance
const config = new Configstore(package.name, { foo: "bar" });

async function updateItem() {}

module.exports = async function () {
  await updateItem();
};
