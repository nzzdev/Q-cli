import Boom from '@hapi/boom';
import Joi from 'joi';
import type { AvailabilityResponseObject, WebPayload } from '@src/interfaces';
import type { Request } from 'hapi__hapi';

export default {
  method: 'POST',
  path: '/option-availability/{optionName}',
  options: {
    validate: {
      payload: Joi.object(),
    },
  },
  handler: function (request: Request): AvailabilityResponseObject | Boom.Boom {
    const payload = request.payload as WebPayload;
    const item = payload.item;
    const optionName = request.params.optionName as string;

    if (optionName === 'showSearch') {
      return {
        available: true,
      };
    }

    return Boom.badRequest();
  },
};
