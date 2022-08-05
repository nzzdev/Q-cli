import Joi from 'joi';
import type { Request } from '@hapi/hapi';
import type { [ToolName]ConfigOptions } from '@src/interfaces';

export default {
  method: 'POST',
  path: '/notification/exampleNotification',
  options: {
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: Joi.object().required(),
    },
    tags: ['api'],
  },
  handler: function (request: Request) {
    try {
      const payload = request.payload as Payload;
      const item = payload.item;

      /** Response is fetched from the locales folder. */
      return {
        message: {
          title: 'notifications.exampleNotification.title',
          body: 'notifications.exampleNotification.body',
        },
      };
    } catch (err) {
      console.log('Error processing /notification/exampleNotification', err);
    }

    return null;
  },
};

/**
 * Payload is defined in the schema.json:
 * showSearch -> notificationChecks -> fields
 */
interface Payload {
  item: {
    options: [ToolName]ConfigOptions;
  };
  roles: string[];
}
