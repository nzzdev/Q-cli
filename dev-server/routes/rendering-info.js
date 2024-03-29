const Joi = require("joi");
const Boom = require("@hapi/boom");
const fetch = require("node-fetch");
const querystring = require("querystring");
const deepmerge = require("deepmerge");

const toolBaseUrl = process.env.TOOL_BASE_URL || "http://localhost:3000";

// try different endpoints to get the right one for the current tool
function getRenderingInfo(item, queryString, config) {
  let promises = [];
  const pathEnds = ["html-static", "html-js", "web"];

  pathEnds.forEach((pathEnd) => {
    promises.push(
      fetch(`${toolBaseUrl}/rendering-info/${pathEnd}?${queryString}`, {
        method: "POST",
        body: JSON.stringify({
          item: item,
          toolRuntimeConfig: config.toolRuntimeConfig,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return undefined;
        }
      })
    );
  });
  return Promise.all(promises);
}

module.exports = {
  method: "GET",
  path: "/rendering-info/{id}/{target}",
  options: {
    validate: {
      params: {
        id: Joi.string().required(),
        target: Joi.string().required(),
      },
      options: {
        allowUnknown: true,
      },
    },
  },
  handler: async function (request, h) {
    try {
      // fetch item with id from array of fixture data
      const target = request.params.target;
      const fixtureDataResponse = await fetch(`${toolBaseUrl}/fixtures/data`);
      if (!fixtureDataResponse.ok) {
        throw new Error(fixtureDataResponse.status);
      }
      const fixtureData = await fixtureDataResponse.json();
      const item = fixtureData[request.params.id];

      // if these attributes are present in current item add them as query params to rendering-info request
      const queryParams = ["_id", "createdDate", "updatedDate"];
      let query = {};
      for (let queryParam of queryParams) {
        if (item.hasOwnProperty(queryParam) && item[queryParam]) {
          query[queryParam] = item[queryParam];
        } else if (queryParam === "_id") {
          query["_id"] = request.params.id;
        }
      }
      let queryString = querystring.stringify(query);

      let toolRuntimeConfig = {
        toolBaseUrl:
          request.server.info.protocol +
          "://" +
          request.server.info.address +
          ":" +
          request.server.info.port +
          "/tools",
      };

      let config;
      if (process.env.CONFIG) {
        const getConfig = require(process.env.CONFIG);
        config = await getConfig();
        // add tool specifc toolRuntimeConfig if it exists
        if (config[target].toolRuntimeConfig) {
          toolRuntimeConfig = Object.assign(
            toolRuntimeConfig,
            config[target].toolRuntimeConfig
          );
        }
      }

      let responses = await getRenderingInfo(item, queryString, {
        toolRuntimeConfig: toolRuntimeConfig,
      });
      let renderingInfo = responses.filter(
        (response) => response !== undefined
      )[0];

      // add target/tool specific additional rendering info to rendering info if it exists
      if (config && config[target].additionalRenderingInfo) {
        renderingInfo = deepmerge(
          renderingInfo,
          config[target].additionalRenderingInfo,
          {
            arrayMerge: (destArr, srcArr) => {
              return srcArr.concat(destArr);
            },
          }
        );
      }

      return h.response(renderingInfo);
    } catch (err) {
      console.log(err);
      if (err.stack) {
        request.server.log(["error"], err.stack);
      }
      if (err.isBoom) {
        return err;
      } else {
        return Boom.serverUnavailable(err.message);
      }
    }
  },
};
