const Hapi = require("@hapi/hapi");
const Joi = require("@hapi/joi");
const Path = require("path");

const server = new Hapi.Server({
  port: process.env.PORT || 5000,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, "public"),
    },
  },
});
server.validator(Joi);

module.exports = server;
