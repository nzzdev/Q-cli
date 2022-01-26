const Hapi = require("@hapi/hapi");
const Joi = require("joi");
const Path = require("path");

const server = new Hapi.Server({
  port: process.env.PORT || 5000,
  routes: {
    cors: {
      origin: ["*"],
    },
    files: {
      relativeTo: Path.join(__dirname, "public"),
    },
  },
});
server.validator(Joi);

module.exports = server;
