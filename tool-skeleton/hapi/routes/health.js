module.exports = {
  path: "/health",
  method: "GET",
  options: {
    tags: ["api"]
  },
  handler: (request, h) => {
    return "ok";
  }
};
