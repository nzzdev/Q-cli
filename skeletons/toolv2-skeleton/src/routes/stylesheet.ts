import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

const __dirname = dirname(fileURLToPath(import.meta.url));

const route: ServerRoute = {
  method: 'GET',
  path: '/stylesheet/{filename}.{hash}.{extension}',
  options: {
    files: {
      relativeTo: path.join(__dirname, '/styles/'),
    },
  },
  handler: function (request: Request, h: ResponseToolkit) {
    const params = request.params as Params;

    return h
      .file(`${params.filename}.${params.extension}`)
      .type('text/css')
      .header('cache-control', `max-age=${60 * 60 * 24 * 365}, immutable`); // 1 year
  },
};

export default route;

interface Params {
  filename: string;
  extension: string;
}
