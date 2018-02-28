const Confidence = require("confidence");

const tool1_editor_config = {
  label_locales: {
    de: "Beispiel-Tool",
    en: "example tool"
  },
  icon:
    '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fill-rule="evenodd"><path d="M5.706 30.294a.996.996 0 0 1-1.412 0l-2.588-2.588a.995.995 0 0 1 0-1.412L19 9l4 4L5.706 30.294zM11 7l4 4-4 4-4-4H5c-1.112 0-2.632-.632-3.41-1.41L1 9 0 6l1-1 3 3 4-4-3-3 1-1 3 1 .59.59C10.366 2.366 11 3.894 11 5v2zM21 25l-4-4 4-4 4 4h2c1.112 0 2.632.632 3.41 1.41L31 23l1 3-1 1-3-3-4 4 3 3-1 1-3-1-.59-.59C21.634 29.634 21 28.106 21 27v-2zM19 1h4l9 9-5 5L16 4z"/></g></svg>'
};

const tools = {
  $filter: "env",
  local: {
    tool1: {
      // tool name
      baseUrl: "http://localhost:3000",
      editor: tool1_editor_config,
      endpoint: {
        $filter: "target",
        $default: false,
        target1: {
          // target name
          path: "/rendering-info/web",
          additionalRenderingInfo: {
            // if needed you can add tool specific stylesheets here, delete otherwise
            // further scripts can be added in a similar manner too
            stylesheets: [
              {
                url: "https://example.com/tool-specific-stylesheet.css" // add some url to a stylesheet here
              },
              {
                content: "h2, p {color: darkgray}" // add some css here
              }
            ]
          },
          toolRuntimeConfig: {
            // if needed add further properties here which the tool needs at runtime
          }
        },
        target2: {
          url: "https://some-other-service.example.com/rendering-info" // you can use a url to use an external service providing the rendering information
        }
      }
    }
  }
};

const env = process.env.APP_ENV || "local";
const store = new Confidence.Store(tools);

module.exports.get = (key, criteria = {}) => {
  criteria = Object.assign({ env: env }, criteria);
  return store.get(key, criteria);
};

module.exports.load = async function() {
  // if needed you could add further async loaded configs here
  store.load(tools);
};

module.exports.meta = (key, criteria = {}) => {
  criteria = Object.assign({ env: env }, criteria);
  return store.meta(key, criteria);
};
