import Joi from 'joi';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Request, ServerRoute, ResponseToolkit } from '@hapi/hapi';

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = __dirname + '/../../resources/locales/';

const route: ServerRoute = {
  path: '/locales/{lng}/translation.json',
  method: 'GET',
  options: {
    description: 'Returns translations for given language',
    tags: ['api'],
    validate: {
      params: {
        lng: Joi.string().required(),
      },
    },
  },
  handler: (request: Request, h: ResponseToolkit) => {
    const params = request.params as Params;
    return h.file(localesDir + params.lng + '/translation.json').type('application/json');
  },
};

export default route;

interface Params {
  lng: string;
}
