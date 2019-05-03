module.exports = [
  require("./file.js"),
  require("./tool-default.js").get,
  require("./tool-default.js").post,
  require("./rendering-info.js")
].concat(require("./dev-view.js"));
