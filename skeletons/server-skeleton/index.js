const Hapi = require("@hapi/hapi");
const Joi = require("joi");
const Pack = require("./package.json");

const plugins = [
  {
    plugin: require("@nzz/q-server/plugins/core/base"),
    options: require("./config/base.js"),
  },
  {
    plugin: require("@nzz/q-server/plugins/core/db"),
    options: require("./config/db.js"),
  },
  {
    plugin: require("@nzz/q-server/plugins/core/editor"),
    options: {
      editorConfig: require("./config/editor.js").get(""),
    },
  },
  {
    plugin: require("@nzz/q-server/plugins/core/rendering-info"),
    options: require("./config/rendering-info.js"),
  },
  {
    plugin: require("@nzz/q-server/plugins/statistics"),
  },
  {
    plugin: require("@nzz/q-server/plugins/fixtures"),
  },
  {
    plugin: require("@nzz/q-server/plugins/screenshot"),
    options: require("./config/screenshot.js").get(""),
  },
  {
    plugin: require("hapi-swagger"),
    options: {
      info: {
        title: "Q Server API",
        version: Pack.version,
      },
    },
  },
];

let server;

async function start() {
  try {
    const toolsConfig = require("./config/tools.js");

    await toolsConfig.load();

    const hapiOptions = {
      port: process.env.PORT || 3001,
      load: { sampleInterval: 1000 },
      app: {
        tools: toolsConfig,
        targets: require("./config/targets.js"),
      },
      routes: {},
    };

    server = Hapi.server(hapiOptions);
    server.validator(Joi);

    await server.register(require("hapi-auth-bearer-token"));
    server.auth.strategy(
      "q-auth",
      "bearer-access-token",
      require("./auth/strategyOptions.js")
    );

    server.route(require("./auth/routes.js"));

    await server.register(plugins);
    await server.start();
    console.log("Server started at: " + server.info.uri);
  } catch (err) {
    console.log(err);
  }
}

start()
  .then(() => {
    console.log("hapi server running");
  })
  .catch((err) => {
    console.log(err, err.stack);
    process.exit(1);
  });

async function gracefullyStop() {
  console.log("stopping hapi server");
  try {
    await server.stop({ timeout: 10000 });
    console.log("hapi server stopped");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  process.exit(0);
}

// listen on SIGINT and SIGTERM signal and gracefully stop the server
process.on("SIGINT", gracefullyStop);
process.on("SIGTERM", gracefullyStop);
