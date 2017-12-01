const Hapi = require('hapi');

const server = new Hapi.Server({
  port: process.env.PORT || 3001
});

module.exports = server;
