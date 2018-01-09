const Confidence = require('confidence');

const renderingInfoConfig = {
  cache: {
    cacheControl: { // these are the default cache-control headers in case a tool is not responding with it's own directives.
      maxAge: {
        $filter: 'env',
        local: 1,
        $default: 60
      },
      sMaxAge: {
        $filter: 'env',
        local: 1,
        $default: 60
      },
      staleWhileRevalidate: { // this is just for the CDN, it will serve maximum 24 hours old content while revalidating in the background
        $filter: 'env',
        local: 1,
        $default: 60 * 60 * 24
      },
      staleIfError: {  // this is just for the CDN, it will serve maximum 7 days old content if the backend is not running
        $filter: 'env',
        local: 1,
        $default: 60 * 60 * 24 * 7
      }
    }
  },
  toolRuntimeConfig: {
    toolBaseUrl: {
      $filter: 'env',
      local: {
        protocol: 'http',
        host: 'localhost:3001',
        path: {
          $filter: 'tool',
          default: undefined,
          chart: '/tools/chart'
        }
      },
      staging: {
        protocol: 'https',
        host: 'q-staging.example.com',
      },
      production: {
        protocol: 'https',
        host: 'q.example.com',
      },
      playground: {
        protocol: 'https',
        host: 'q-playground.example.com',
      }
    },
  }
}

const env = process.env.APP_ENV || 'local';
const store = new Confidence.Store(renderingInfoConfig);

module.exports.get = (key, criteria = {}) => {
  criteria = Object.assign({ env: env }, criteria)
  return store.get(key, criteria)
}

module.exports.meta = (key, criteria = {}) => {
  criteria = Object.assign({ env: env }, criteria)
  return store.meta(key, criteria)
}
