import Ajv from 'ajv';
import Boom from '@hapi/boom';
import getExactPixelWidth from '@helpers/toolRuntimeConfig.js';
import { readFileSync } from 'fs';
import schemaString from '@rs/schema.json';
import type { Request, ServerRoute } from '@hapi/hapi';
import type {
  AvailabilityResponseObject,
  DisplayOptions,
  [ToolName]Config,
  [ToolName]ConfigOptions,
  [ToolName]SvelteProperties,
  RenderingInfo,
  StyleHashMap,
  ToolRuntimeConfig,
  WebPayload,
} from '@src/interfaces';

const ajv = new Ajv();
const validate = ajv.compile(schemaString);

const route: ServerRoute = {
  method: 'POST',
  path: '/rendering-info/web',
  options: {
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: async payload => {
        const payloadTyped = payload as WebPayload;
        const item = payloadTyped.item;
        const toolRuntimeConfig = payloadTyped.toolRuntimeConfig;

        if (typeof payloadTyped !== 'object' || typeof item !== 'object' || typeof toolRuntimeConfig !== 'object') {
          throw Boom.badRequest('The given payload for this route is not correct.');
        }

        if (await validate(item)) {
          return item;
        } else {
          throw Boom.badRequest(JSON.stringify(validate.errors));
        }
      },
    },
  },
  handler: function (request: Request) {
    const id = createId(request);
    let qtableCompiledScript = '';
    let styleHashMap: StyleHashMap | null = null;

    try {
      qtableCompiledScript = readFileSync('dist/[Tool-name].js', {
        encoding: 'utf-8',
      });
    } catch (e) {
      console.log('Failed reading compiled [Tool-name] code - ', e);
    }

    try {
      const rawString = readFileSync('dist/styles/hashMap.json', {
        encoding: 'utf-8',
      });

      styleHashMap = JSON.parse(rawString) as StyleHashMap;
    } catch (e) {
      console.log('Failed reading compiled style hashmap - ', e);
    }

    const payload = request.orig.payload as WebPayload;

    // Extract table configurations.
    const config = payload.item;

    const toolRuntimeConfig = payload.toolRuntimeConfig || {};
    const displayOptions = toolRuntimeConfig.displayOptions || ({} as DisplayOptions);
    const options = config.options;

    const width = getExactPixelWidth(toolRuntimeConfig);

    const props: [ToolName]SvelteProperties = {
      config,
      displayOptions,
      noInteraction: payload.toolRuntimeConfig.noInteraction || false,
      id,
      width,
    };

    const renderingInfo: RenderingInfo = {
      polyfills: ['Promise'],
      stylesheets: [],
      scripts: [
        {
          content: qtableCompiledScript,
        },
        {
          content: `
          (function () {
            var target = document.querySelector('#${id}_container');
            target.innerHTML = "";
            var props = ${JSON.stringify(props)};
            new window.[tool_name]({
              "target": target,
              "props": {
                props: props
              }
            })
          })();`,
        },
      ],

      markup: `<div id="${id}" class="[tool-name]-container" />`,
    };

    if (styleHashMap !== null) {
      renderingInfo.stylesheets.push({
        name: styleHashMap['main'],
      });
    }

    return renderingInfo;
  },
};

/**
 *
 * Example of code if you ever need to check if an option is avaible within the
 * handler.
 */
// async function areMinibarsAvailable(request: Request, config: QTableConfig): Promise<boolean> {
//   const response = await request.server.inject({
//     url: '/option-availability/selectedColumnMinibar',
//     method: 'POST',
//     payload: { item: config },
//   });

//   const result = response.result as AvailabilityResponseObject | undefined;
//   if (result) {
//     return result.available;
//   } else {
//     console.log('Error receiving result for /option-availability/selectedColumnMinibar', result);
//     return false;
//   }
// }

function createId(request: Request): string {
  return `[tool_name]_${request.query._id}_${Math.floor(Math.random() * 100000)}`.replace(/-/g, '');
}

export default route;
