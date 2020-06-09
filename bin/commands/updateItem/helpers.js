const fetch = require("node-fetch");
const path = require("path");

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
    throw new Error(
      `Error occured while authenticating: (${response.status}) ${response.statusText}`
    );
  }
}

async function checkValidityOfAccessToken(QServerAccessToken) {
  const response = await fetch(`${itemUrl}/`, {
    headers: {
      Authorization: `Bearer ${QServerAccessToken}`,
    },
  });
  if (response.ok) {
    return await response.json();
  }
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

module.exports = {
  getItem: getItem,
  saveItem: saveItem,
  getQServerAccessToken: getQServerAccessToken,
  checkValidityOfAccessToken: checkValidityOfAccessToken,
  getCurrentDirectoryBase: getCurrentDirectoryBase,
};
