const Confidence = require("confidence");

const targets = [
  {
    key: "target1",
    label: "Target 1",
    type: "web",
    context: {
      stylesheets: [
        {
          url: "https://example.com/stylesheet-for-preview.css"
        }
      ],
      background: {
        color: "white"
      }
    }
  }
];

const env = process.env.APP_ENV || "local";
const store = new Confidence.Store(targets);

module.exports.get = (key, criteria = {}) => {
  criteria = Object.assign({ env: env }, criteria);
  return store.get(key, criteria);
};

module.exports.meta = (key, criteria = {}) => {
  criteria = Object.assign({ env: env }, criteria);
  return store.meta(key, criteria);
};
