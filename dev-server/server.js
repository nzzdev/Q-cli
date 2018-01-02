const Hapi = require('hapi')

const server = new Hapi.Server({
  port: process.env.PORT || 5000
})

module.exports = server
