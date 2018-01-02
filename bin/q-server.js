const path = require('path')

const program = require('commander')
  .option('-p, --port [port]', 'the port to start the server on')
  .parse(process.argv)  

if (program.port) {
  process.env.PORT = program.port
}

startServer()

async function startServer() {

  const server = require(path.join(__dirname, '../dev-server/server.js'))
  const plugins = require(path.join(__dirname, '../dev-server/server-plugins.js'))
  const routes = require(path.join(__dirname, '../dev-server/routes/routes.js'))

  await server.register(plugins)

  server.route(routes)

  await server.start()

  console.log('Server running at: ', server.info.uri)
}