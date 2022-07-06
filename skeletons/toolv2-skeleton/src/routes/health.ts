import type { ServerRoute } from '@hapi/hapi';

const route: ServerRoute = {
  path: '/health',
  method: 'GET',
  options: {
    tags: ['api'],
  },
  handler: () => {
    return 'ok';
  },
};

export default route;
