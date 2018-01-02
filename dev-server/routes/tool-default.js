const Joi = require('joi')
const Wreck = require('wreck')
const querystring = require('querystring')
const fetch = require('node-fetch')

const toolBaseUrl = process.env.TOOL_BASE_URL || 'http://localhost:3000'

async function handler (request, h, payload = null) {
  let queryString = ''
  if (request.query && Object.keys(request.query).length > 0) {
    queryString = querystring.stringify(request.query)
  }

  let toolResponse
  if (payload) {
    toolResponse = await Wreck.post(`${toolBaseUrl}/${request.params.path}?${queryString}`, {
      payload: payload
    })
  } else {
    toolResponse = await Wreck.get(`${toolBaseUrl}/${request.params.path}?${queryString}`)
  }

  // prepare the response to add more headers
  const response = h.response(toolResponse.payload)

  // set all the headers from the tool response
  for (let header in toolResponse.res.headers) {
    response.header(header, toolResponse.res.headers[header])
  }

  return response
}

module.exports = {
  get: {
    path: '/tools/{path*}',
    method: 'GET',
    options: {
      validate: {
        params: {
          path: Joi.string().required()
        },
        query: {
          appendItemToPayload: Joi.string().optional()
        },
        options: {
          allowUnknown: true
        }
      },
      cors: true
    },
    handler: async (request, h) => {
      let payload = null
      if (request.query.appendItemToPayload) {
        // we use fixture data here instead of items in db
        const fixtureDataResponse = await fetch(`${toolBaseUrl}/fixtures/data`)
        if (!fixtureDataResponse.ok) {
          throw new Error(fixtureDataResponse.status)
        }

        const fixtureData = await fixtureDataResponse.json()
        // appendItemToPayload = item id = index in fixtures data array
        const item = fixtureData[request.query.appendItemToPayload]
        payload = {
          item: item
        }
      }
      return Reflect.apply(handler, this, [request, h, payload])
    }
  },
  post: {
    path: '/tools/{path*}',
    method: 'POST',
    options: {
      validate: {
        params: {
          path: Joi.string().required()
        },
        query: {
          appendItemToPayload: Joi.string().optional()
        },
        payload: Joi.object(),
        options: {
          allowUnknown: true
        }
      },
      cors: true
    },
    handler: async (request, h) => {
      if (request.query.appendItemToPayload) {
        // we use fixture data here instead of items in db
        const fixtureDataResponse = await fetch(`${toolBaseUrl}/fixtures/data`)
        if (!fixtureDataResponse.ok) {
          throw new Error(fixtureDataResponse.status)
        }

        const fixtureData = await fixtureDataResponse.json()
        // appendItemToPayload = item id = index in fixtures data array
        const item = fixtureData[request.query.appendItemToPayload]
        request.payload.item = item
      }
      return Reflect.apply(handler, this, [request, h, request.payload])
    }
  }
}
