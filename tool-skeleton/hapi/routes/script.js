const path = require("path");

module.exports = {
  method: "GET",
  path: "/script/{filename}.{hash}.{extension}",
  options: {
    cors: true,
    files: {
      relativeTo: path.join(__dirname, "/../scripts/")
    }
  },
  handler: function(request, h) {
    return h
      .file(`${request.params.filename}.${request.params.extension}`)
      .type("text/javascript")
      .header("cache-control", `max-age=${60 * 60 * 24 * 365}, immutable`); // 1 year
  }
};
