const helpers = require("./helpers.js");
const promptly = require("promptly");
const Configstore = require("configstore");
const package = require("./../../../package.json");
const configStore = new Configstore(package.name, {});

async function setAuthenticationConfig(environment, qServer) {
  const result = await authenticate(environment, qServer);
  configStore.set(`${environment}.accessToken`, result.accessToken);
  configStore.set(`${environment}.cookie`, result.cookie);
}

async function setupStore(qConfig, environmentFilter, reset) {
  if (reset) {
    configStore.clear();
  }
  for (const environment of helpers.getEnvironments(
    qConfig,
    environmentFilter
  )) {
    await setupConfigFromEnvVars(environment);

    if (!configStore.get(`${environment}.qServer`)) {
      const qServer = await promptly.prompt(
        `Enter the Q-Server url for ${environment} environment: `,
        {
          validator: (qServer) => {
            return new URL(qServer).toString();
          },
          retry: true,
        }
      );
      configStore.set(`${environment}.qServer`, qServer);
    }

    const qServer = configStore.get(`${environment}.qServer`);
    if (!configStore.get(`${environment}.accessToken`)) {
      await setAuthenticationConfig(environment, qServer);
    }

    const accessToken = configStore.get(`${environment}.accessToken`);
    const cookie = configStore.get(`${environment}.cookie`);
    const isAccessTokenValid = await helpers.checkValidityOfAccessToken(
      environment,
      qServer,
      accessToken,
      cookie
    );

    // Get a new access token in case its not valid anymore
    if (!isAccessTokenValid) {
      await setAuthenticationConfig(environment, qServer);
    }
  }

  return configStore;
}

async function setupConfigFromEnvVars(environment) {
  const environmentPrefix = environment.toUpperCase();

  const qServer = process.env[`Q_${environmentPrefix}_SERVER`];
  if (qServer) {
    configStore.set(`${environment}.qServer`, qServer);
  }
  const accessToken = process.env[`Q_${environmentPrefix}_ACCESSTOKEN`];
  const username = process.env[`Q_${environmentPrefix}_USERNAME`];
  const password = process.env[`Q_${environmentPrefix}_PASSWORD`];
  if (qServer && accessToken) {
    configStore.set(`${environment}.accessToken`, accessToken);
  } else if (qServer && username && password) {
    const cookie = configStore.get(`${environment}.cookie`);
    const result = await helpers.getAccessToken(
      environment,
      qServer,
      username,
      password,
      cookie
    );

    if (!result) {
      console.error(
        errorColor(
          `A problem occured while authenticating to the ${environment} environment using environment variables. Please check your credentials and try again.`
        )
      );
      process.exit(1);
    }

    configStore.set(`${environment}.accessToken`, result.accessToken);
    configStore.set(`${environment}.cookie`, result.cookie);
  }
}

async function authenticate(environment, qServer) {
  let username = configStore.get(`${environment}.username`);
  if (!username) {
    username = await promptly.prompt(
      `Enter your username on ${environment} environment: `,
      { validator: (username) => username.trim() }
    );
    configStore.set(`${environment}.username`, username);
  }

  const password = await promptly.password(
    `Enter your password on ${environment} environment: `,
    {
      validator: async (password) => password.trim(),
      replace: "*",
    }
  );

  const cookie = configStore.get(`${environment}.cookie`);
  let result = await helpers.getAccessToken(
    environment,
    qServer,
    username,
    password,
    cookie
  );

  while (!result) {
    console.error(
      errorColor(
        "A problem occured while authenticating. Please check your credentials and try again."
      )
    );

    result = await authenticate(environment, qServer);

    if (result.accessToken) {
      break;
    }
  }

  return result;
}

module.exports = {
  store: configStore,
  setupStore: setupStore,
};
