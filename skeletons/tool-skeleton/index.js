const Hapi = require("@hapi/hapi");
const Joi = require("joi");

const server = Hapi.server({
  port: process.env.PORT || 3000,
  routes: {
    cors: true,
  },
});
server.validator(Joi);

const routes = require("./routes/routes.js");

async function init() {
  await server.register(require("@hapi/inert"));
  server.route(routes);
  await server.start();
  console.log("server running ", server.info.uri);
}

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

init();
