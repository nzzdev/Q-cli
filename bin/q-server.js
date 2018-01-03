const path = require('path')

const program = require('commander')
  .option('-p, --port [port]', 'the port to start the server on')
  .option('-t, --target [target]', 'the target being used for rendering info route')
  .parse(process.argv)  

if (program.port) {
  process.env.PORT = program.port
}

if (program.target) {
  process.env.TARGET = program.target
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
  console.log(`Target being used: ${process.env.TARGET || 'nzz_ch'}`)
}