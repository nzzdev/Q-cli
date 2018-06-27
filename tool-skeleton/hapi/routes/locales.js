const Joi = require("joi");
const localesDir = __dirname + "/../resources/locales/";

module.exports = {
  path: "/locales/{lng}/translation.json",
  method: "GET",
  options: {
    description: "Returns translations for given language",
    tags: ["api"],
    validate: {
      params: {
        lng: Joi.string().required()
      }
    }
  },
  handler: (request, h) => {
    return h
      .file(localesDir + request.params.lng + "/translation.json")
      .type("application/json");
  }
};
