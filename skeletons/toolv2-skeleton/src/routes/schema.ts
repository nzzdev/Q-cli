import schema from '../../resources/schema.json';
import displayOptionsSchema from '../../resources/display-options-schema.json';
import type { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

const schemaRoute: ServerRoute = {
  method: 'GET',
  path: '/schema.json',
  handler: function (request: Request, h: ResponseToolkit) {
    return h.response(schema);
  },
};

const displayOptionsRoute: ServerRoute = {
  method: 'GET',
  path: '/display-options-schema.json',
  handler: function (request: Request, h: ResponseToolkit) {
    return h.response(displayOptionsSchema);
  },
};

export default [schemaRoute, displayOptionsRoute];
