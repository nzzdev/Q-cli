const path = require("path");
const Nunjucks = require("nunjucks");

async function startServer() {
  const server = require(path.join(__dirname, "../../dev-server/server.js"));
  const plugins = require(path.join(
    __dirname,
    "../../dev-server/server-plugins.js"
  ));
  const routes = require(path.join(
    __dirname,
    "../../dev-server/routes/routes.js"
  ));
  await server.register(plugins);
  server.views({
    engines: {
      html: {
        compile: (src, options) => {
          const template = Nunjucks.compile(src, options.environment);
          return (context) => {
            return template.render(context);
          };
        },

        prepare: (options, next) => {
          options.compileOptions.environment = Nunjucks.configure(
            options.path,
            { watch: false }
          );
          return next();
        },
      },
    },
    path: `${path.join(__dirname, "../../dev-server/views")}`,
  });

  server.route(routes);

  await server.start();

  console.log("Server running at: ", server.info.uri);
  console.log(`Target being used: ${process.env.TARGET || "nzz_ch"}`);
  console.log(
    `Tool base url being used: ${
      process.env.TOOL_BASE_URL || "http://localhost:3000"
    }`
  );
  if (process.env.CONFIG) {
    console.log(`Config module will be loaded from: ${process.env.CONFIG}`);
  }
}

module.exports = async function (command) {
  if (command.port) {
    process.env.PORT = command.port;
  }

  if (command.target) {
    process.env.TARGET = command.target;
  }

  if (command.toolBaseUrl) {
    process.env.TOOL_BASE_URL = command.toolBaseUrl;
  }

  if (command.config) {
    if (path.isAbsolute(command.config)) {
      process.env.CONFIG = command.config;
    } else {
      process.env.CONFIG = path.join(process.cwd(), command.config);
    }
  } else {
    process.env.CONFIG = path.join(
      __dirname,
      "../../dev-server/config/default.js"
    );
  }

  await startServer();
};
