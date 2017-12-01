'use strict';

const start = async function () {
  const server = require('./server.js');
  // const plugins = require('./server-plugins.js');
  const routes = require('./routes/routes.js');
  
  // await server.register(plugins);
  
  server.route(routes);
  
  await server.start();
  
  console.log('Server running at: ', server.info.uri)

}

start();