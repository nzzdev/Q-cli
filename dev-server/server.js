const Hapi = require("hapi");
const Path = require("path");

const server = new Hapi.Server({
  port: process.env.PORT || 5000,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, "public")
    }
  }
});

module.exports = server;
