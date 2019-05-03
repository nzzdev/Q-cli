module.exports = [
  {
    method: "GET",
    path: "/dev",
    handler: async (request, h) => {
      const target = process.env.TARGET || "nzz_ch";

      // add target and port
      const viewData = {
        port: process.env.PORT || 5000,
        target: target
      };

      // add context config if available
      if (process.env.CONFIG) {
        const getConfig = require(process.env.CONFIG);
        const config = await getConfig();

        if (config[target].context) {
          viewData.context = config[target].context;
        }
      }

      return h.view("index", viewData);
    }
  },
  {
    method: "GET",
    path: "/",
    handler: async (request, h) => {
      const target = process.env.TARGET || "nzz_ch";

      // add target and port
      const viewData = {
        port: process.env.PORT || 5000,
        target: target
      };

      // add context config if available
      if (process.env.CONFIG) {
        const getConfig = require(process.env.CONFIG);
        const config = await getConfig();

        if (config[target].context) {
          viewData.context = config[target].context;
        }
      }

      return h.view("index", viewData);
    }
  }
];
