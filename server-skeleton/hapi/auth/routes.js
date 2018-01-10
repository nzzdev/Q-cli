const Joi = require('joi');
const Boom = require('boom');
const fetch = require('node-fetch');
const nano = require('nano');

module.exports = [
  {
    path: '/authenticate',
    method: 'POST',
    options: {
      validate: {
        payload: {
          username: Joi.string().required(),
          password: Joi.string().required()
        }
      },
      cors: {
        credentials: true
      }
    },
    handler: async (request, h) => {
      if (request.payload.username === 'demo-user'
       || request.payload.username === 'demo-expert'
       || request.payload.username === 'demo-poweruser') {
        return {
          access_token: request.payload.username
        }
      };
    }
  },
  {
    path: '/user',
    method: 'GET',
    config: {
      auth: 'q-auth',
      cors: {
        credentials: true
      }
    },
    handler: (request, h) => {
      if (!request.auth.isAuthenticated) {
        throw Boom.unauthorized();
      }

      const user = {
        username: request.auth.credentials.name,
        department: 'Politics',
        publication: 'pub1',
        initials: '🤖'
      }

      if (user.username === 'demo-expert' || user.username === 'demo-poweruser') {
        user.roles = [
          'expert-election-executive',
          'expert-election-votes',
          'expert-election-seats',
          'expert-map',
          'expert-chart',
          'expert-coalition-calculation'
        ]
      }

      if (user.username === 'demo-poweruser') {
        user.roles.push('poweruser');
      }

      return user;
    }
  },
  {
    path: '/user',
    method: 'PUT',
    config: {
      auth: 'q-auth',
      validate: {
        payload: {
          username: Joi.string().required()
        },
        options: {
          allowUnknown: true
        }
      },
      cors: {
        credentials: true
      }
    },
    handler: async (request, h) => {
      return 'ok';
    }
  }
];