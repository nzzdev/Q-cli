/**
 * Dynamic schemas return options to a field that change depending
 * other settings. Hence, dynamic options.
 *
 * You can write your logic in the handler and return whatever options
 * are decided.
 */
import Joi from 'joi';
import type { [ToolName]ConfigOptions } from '@src/interfaces';
import type { Request, ServerRoute } from '@hapi/hapi';

const route: ServerRoute = {
  method: 'POST',
  path: '/dynamic-schema/exampleDynamicSchema',
  options: {
    validate: {
      payload: Joi.object(),
    },
  },
  handler: function (request: Request): ExampleDynamicSchemeReturnPayload {
    const payload = request.payload as Payload;
    const options = payload.item.options;

    return {
      enum: ['one', 'two', 'three', 'four'],
      'Q:options': {
        enum_titles: ['1', '2', '3', '4'],
      },
    };
  },
};

export default route;

/**
 * Interfaces.
 */
interface Payload {
  item: {
    options: [ToolName]ConfigOptions;
  };
}

export interface ExampleDynamicSchemeReturnPayload {
  enum: string[];
  'Q:options': {
    enum_titles: string[];
  };
}
