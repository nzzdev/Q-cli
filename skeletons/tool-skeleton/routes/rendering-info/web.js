const Boom = require("@hapi/boom");
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

const staticViewsDir = path.join(__dirname, "/../../views/static/");
const stylesDir = path.join(__dirname, "/../../styles/");
const scriptsDir = path.join(__dirname, "../../scripts/");

require("svelte/register");
const staticTemplate = require(path.join(
  staticViewsDir,
  "/App.svelte"
)).default;
const styles = fs.readFileSync(path.join(stylesDir, "/default.css")).toString();
const styleHashMap = require(path.join(stylesDir, "hashMap.json"));
const scriptHashMap = require(path.join(scriptsDir, "hashMap.json"));

// POSTed item will be validated against given schema
// hence we fetch the JSON schema...
const schemaString = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../resources/", "schema.json"), {
    encoding: "utf-8",
  })
);

const ajv = new Ajv({ strict: false });
const validate = ajv.compile(schemaString);

function validateAgainstSchema(item, options) {
  if (validate(item)) {
    return item;
  } else {
    throw Boom.badRequest(JSON.stringify(validate.errors));
  }
}

async function validatePayload(payload, options, next) {
  if (typeof payload !== "object") {
    return next(Boom.badRequest(), payload);
  }
  if (typeof payload.item !== "object") {
    return next(Boom.badRequest(), payload);
  }
  if (typeof payload.toolRuntimeConfig !== "object") {
    return next(Boom.badRequest(), payload);
  }
  await validateAgainstSchema(payload.item, options);
}

module.exports = {
  method: "POST",
  path: "/rendering-info/web",
  options: {
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: validatePayload,
    },
  },
  handler: async function (request, h) {
    const toolRuntimeConfig = request.payload.toolRuntimeConfig;
    const context = {
      // TODO: Rename 'q_your_tool_' to 'q_<tool_name>_'
      id: `q_your_tool_${toolRuntimeConfig.requestId}`,
      displayOptions: toolRuntimeConfig.displayOptions || {},
      item: request.payload.item,
    };

    const staticTemplateRender = staticTemplate.render(context);

    const renderingInfo = {
      polyfills: ["Promise"],
      stylesheets: [{ content: styles }, { name: styleHashMap["default"] }],
      scripts: [
        { name: scriptHashMap["default"] },
        // TODO: Rename 'new window._q_your_tool.YourTool' to 'new window._q_<tool-name>.<ToolName>'
        {
          content: `
          (function () {
            var target = document.querySelector('#${context.id}_container');
            target.innerHTML = "";
            var props = ${JSON.stringify(context)};
            new window._q_your_tool.YourTool({
              "target": target,
              "props": props
            })
          })();`,
        },
      ],
      markup: staticTemplateRender.html,
    };

    return renderingInfo;
  },
};
