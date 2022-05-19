const fetch = require("node-fetch");
const chalk = require("chalk");
const errorColor = chalk.red;

function getEnvironments(qConfig, environmentFilter) {
  try {
    const environments = new Set();
    for (const item of qConfig.items) {
      for (const environment of item.environments) {
        if (environmentFilter) {
          if (environmentFilter === environment.name) {
            environments.add(environment.name);
          }
        } else {
          environments.add(environment.name);
        }
      }
    }

    if (environments.size > 0) {
      return Array.from(environments);
    } else {
      throw new Error(
        `No items with environment ${environmentFilter} found. Please check your configuration and try again.`
      );
    }
  } catch (error) {
    console.error(errorColor(error.message));
    process.exit(1);
  }
}

async function getAccessToken(
  environment,
  qServer,
  username,
  password,
  cookie
) {
  try {
    const response = await fetch(`${qServer}authenticate`, {
      method: "POST",
      headers: {
        "user-agent": "Q Command-line Tool",
        origin: qServer,
        Cookie: cookie ? cookie : "",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      const body = await response.json();
      return {
        accessToken: body.access_token,
        cookie: response.headers.get("set-cookie"),
      };
    }

    return false;
  } catch (error) {
    console.error(
      errorColor(
        `A problem occured while authenticating on ${environment} environment. Please check your connection and try again.`
      )
    );
    process.exit(1);
  }
}

async function checkValidityOfAccessToken(
  environment,
  qServer,
  accessToken,
  cookie
) {
  try {
    const response = await fetch(`${qServer}user`, {
      headers: {
        "user-agent": "Q Command-line Tool",
        Authorization: `Bearer ${accessToken}`,
        Cookie: cookie ? cookie : "",
      },
    });
    return response.ok;
  } catch (error) {
    console.error(
      errorColor(
        `A problem occured while checking the validity of your access token on ${environment} environment. Please check your connection and try again.`
      )
    );
    process.exit(1);
  }
}

module.exports = {
  getEnvironments: getEnvironments,
  getAccessToken,
  checkValidityOfAccessToken,
};
