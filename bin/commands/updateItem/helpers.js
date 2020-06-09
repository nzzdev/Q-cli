const fetch = require("node-fetch");
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv();

async function getQServerAccessToken(QServerBaseUrl, username, password) {
  const response = await fetch(`${QServerBaseUrl}authenticate`, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  if (response.ok) {
    const body = await response.json();
    return body.access_token;
  } else {
    console.log(
      "An unexpected error occured. Please check the entered information and try again."
    );
  }
}

async function checkValidityOfAccessToken(QServerBaseUrl, QServerAccessToken) {
  const response = await fetch(`${QServerBaseUrl}user`, {
    headers: {
      Authorization: `Bearer ${QServerAccessToken}`,
    },
  });
  return response.ok;
}

async function getItem(QServerBaseUrl, QServerAccessToken, id) {
  const response = await fetch(`${QServerBaseUrl}item/${id}`, {
    headers: {
      Authorization: `Bearer ${QServerAccessToken}`,
    },
  });
  if (response.ok) {
    return await response.json();
  }
}

async function saveItem(QServerBaseUrl, QServerAccessToken, item) {
  delete item.updatedDate;
  const response = await fetch(`${QServerBaseUrl}item`, {
    method: "PUT",
    body: JSON.stringify(item),
    headers: {
      Authorization: `Bearer ${QServerAccessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    return await response.json();
  }
}

function getCurrentDirectoryBase() {
  return path.basename(process.cwd());
}

function validateConfig(config) {
  const isValid = ajv.validate(require("./schema.json"), config);
  if (!isValid) {
    console.log(ajv.errorsText());
    process.exit(1);
  }

  return isValid;
}

module.exports = {
  getItem: getItem,
  saveItem: saveItem,
  getQServerAccessToken: getQServerAccessToken,
  checkValidityOfAccessToken: checkValidityOfAccessToken,
  getCurrentDirectoryBase: getCurrentDirectoryBase,
  validateConfig: validateConfig,
};
