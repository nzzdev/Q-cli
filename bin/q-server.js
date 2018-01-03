const path = require('path')

const program = require('commander')
  .option('-p, --port [port]', 'the port to start the server on')
  .option('-t, --target [target]', 'the target being used for rendering info route')
  .option('-b, --tool-base-url [url]', 'the tool base url being set in rendering info route')
  .option('-c, --config [config]', 'the config file name in which additional rendering info and tool runtime config is specified')
  .parse(process.argv)  

if (program.port) {
  process.env.PORT = program.port
}

if (program.target) {
  process.env.TARGET = program.target
}

if (program.toolBaseUrl) {
  process.env.TOOL_BASE_URL = program.toolBaseUrl
}

if (program.config) {
  process.env.CONFIG = program.config
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
  console.log(`Tool base url being used: ${process.env.TOOL_BASE_URL || 'http://localhost:3000'}`)
}