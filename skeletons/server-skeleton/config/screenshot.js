const Confidence = require("confidence");

// used in screenshot plugin
function resolvePath(resource, env) {
  if (!resource.url && resource.path) {
    resource.url = `${process.env.Q_SERVER_BASE_URL}${resource.path}`;
  }
  delete resource.path;
  return resource;
}

const screenshot = {
  getScripts: function(renderingInfo) {
    const scripts = [];
    if (
      renderingInfo.loaderConfig &&
      renderingInfo.loaderConfig.loadSystemJs === "full"
    ) {
      scripts.push({ url: `${process.env.Q_SERVER_BASE_URL}/files/system.js` });
    }
    if (renderingInfo.loaderConfig && renderingInfo.loaderConfig.polyfills) {
      scripts.push({
        url: `https://cdn.polyfill.io/v2/polyfill.min.js?features=${renderingInfo.loaderConfig.polyfills.join(
          ","
        )}`
      });
    }
    if (renderingInfo.scripts && Array.isArray(renderingInfo.scripts)) {
      for (let script of renderingInfo.scripts) {
        script = resolvePath(script);
        scripts.push(script);
      }
    }
    return scripts;
  },
  getStylesheets: function(renderingInfo) {
    const stylesheets = [];
    if (renderingInfo.stylesheets && Array.isArray(renderingInfo.stylesheets)) {
      for (let stylesheet of renderingInfo.stylesheets) {
        stylesheet = resolvePath(stylesheet);
        stylesheets.push(stylesheet);
      }
    }
    return stylesheets;
  },
  cache: {
    cacheControl: {
      // these cache control directives are sent in the cache-control header of the response to screenshot api
      maxAge: {
        $filter: "env",
        local: 1,
        $default: 60
      },
      sMaxAge: {
        // this is just for the CDN, it will mark screenshots as stale after 24 hours. we use keycdn plugin to purge it on item.update
        $filter: "env",
        local: 1,
        $default: 60 * 60 * 24
      },
      staleWhileRevalidate: {
        // this is just for the CDN, it will serve maximum 7 days old content while revalidating in the background
        $filter: "env",
        local: 1,
        $default: 60 * 60 * 24 * 7
      },
      staleIfError: {
        // this is just for the CDN, it will serve maximum 7 days old content if the backend is responding with an error
        $filter: "env",
        local: 1,
        $default: 60 * 60 * 24 * 7
      }
    }
  }
};

const env = process.env.APP_ENV || "local";
const store = new Confidence.Store(screenshot);

module.exports.get = (key, criteria = {}) => {
  criteria = Object.assign({ env: env }, criteria);
  return store.get(key, criteria);
};

module.exports.meta = (key, criteria = {}) => {
  criteria = Object.assign({ env: env }, criteria);
  return store.meta(key, criteria);
};
