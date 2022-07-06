/**
 * @jest-environment jsdom
 */

// https://github.com/prisma/prisma/issues/8558#issuecomment-1102176746
global.setImmediate = global.setImmediate || ((fn: () => unknown, ...args: []) => global.setTimeout(fn, 0, ...args));

import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { getAvailabilityResponse, getMarkup, getScripts, getStylesheets } from './helpers';
import type { ExampleDynamicSchemeReturnPayload } from '@src/routes/dynamic-schemas/exampleDynamicSchema';
import { create[ToolName]ConfigFixture } from '@src/helpers/fixture-generators';

// We ignore because this will be built before you run the tests.
// @ts-ignore
import routes from '../dist/routes.js';

let server: Hapi.Server;

// Start the server before the tests.
beforeAll(async () => {
  try {
    server = Hapi.server({
      port: process.env.PORT || 3000,
    });
    server.validator(Joi);
    server.route(routes);
  } catch (err) {
    expect(err).not.toBeDefined();
  }
});

afterAll(async () => {
  await server.stop({ timeout: 2000 });

  // @ts-ignore.
  server = null;
});

describe('basics', () => {
  it('starts the server', () => {
    expect(server.info.created).toEqual(expect.any(Number));
  });

  it('is healthy', async () => {
    const response = await server.inject('/health');
    expect(response.payload).toEqual('ok');
  });
});

describe('rendering-info/web', () => {
  it('renders the tool', async () => {
    const config = create[ToolName]ConfigFixture();

    const response = await server.inject({
      url: '/rendering-info/web?_id=someid',
      method: 'POST',
      payload: {
        item: config,
        toolRuntimeConfig: {},
      },
    });

    expect(response.statusCode).toEqual(200);

    const markup = getMarkup(response.result);
    const stylesheets = getStylesheets(response.result);
    const scripts = getScripts(response.result);

    const foundMarkupId = markup.includes('id="[tool_name]_someid_');
    const foundMarkupClass = markup.includes('class="[tool-name]-container"');
    expect(foundMarkupId).toBe(true);
    expect(foundMarkupClass).toBe(true);

    const foundStylesheet = stylesheets[0].name.startsWith('main.');
    expect(foundStylesheet).toBe(true);

    expect(scripts[0].content).toEqual(expect.any(String));
  });

  it('returns 400 if no payload given', async () => {
    const response = await server.inject({
      url: '/rendering-info/web?_id=someid',
      method: 'POST',
    });
    expect(response.statusCode).toEqual(400);
  });

  it('returns 400 if no item given in payload', async () => {
    const response = await server.inject({
      url: '/rendering-info/web?_id=someid',
      method: 'POST',
      payload: {
        item: {},
      },
    });
    expect(response.statusCode).toEqual(400);
  });

  it('returns 400 if no toolRuntimeConfig given in payload', async () => {
    const response = await server.inject({
      url: '/rendering-info/web?_id=someid',
      method: 'POST',
      payload: {
        toolRuntimeConfig: {},
      },
    });
    expect(response.statusCode).toEqual(400);
  });

  it('returns 400 if invalid item given', async () => {
    const response = await server.inject({
      url: '/rendering-info/web?_id=someid',
      method: 'POST',
      payload: {
        item: { foo: 'bar' },
        toolRuntimeConfig: {},
      },
    });
    expect(response.statusCode).toEqual(400);
  });
});

describe('option availability endpoint example', () => {
  it('returns true for option availability of example', async () => {
    const request = {
      method: 'POST',
      url: '/option-availability/showSearch',
      payload: {
        item: {},
      },
    };
    const response = await server.inject(request);

    const available = getAvailabilityResponse(response.result);
    expect(available).toEqual(true);
  });

});

describe('example dynamic schema endpoint', () => {
  it('returns correct response for exampleDynamicSchema', async () => {
    const request = {
      method: 'POST',
      url: '/dynamic-schema/exampleDynamicSchema',
      payload: {
        item: {}
      },
    };

    const response = await server.inject(request);

    const result = response.result as ExampleDynamicSchemeReturnPayload;

    expect(result.enum).toEqual(['one', 'two', 'three', 'four']);
    expect(result['Q:options'].enum_titles).toEqual(['1', '2', '3', '4']);
  });
});
