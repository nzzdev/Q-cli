import Hapi from '@hapi/hapi';
import routes from './dist/routes.js';

// Because the package is set as module we cannot directly call require
// in js files. We must import and create it.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const server = Hapi.server({
  port: process.env.PORT || 3000,
});

async function init() {
  await server.register(require('@hapi/inert'));
  server.validator(require('joi'));

  server.route(routes);

  await server.start();
  console.log('server running ', server.info.uri);
}

init();

async function gracefullyStop() {
  console.log('stopping hapi server');
  try {
    await server.stop({ timeout: 10000 });
    console.log('hapi server stopped');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  process.exit(0);
}

// listen on SIGINT and SIGTERM signal and gracefully stop the server.
process.on('SIGINT', gracefullyStop);
process.on('SIGTERM', gracefullyStop);
