const rootDir = __dirname + '/..';

module.exports = {
  method: 'GET',
  path: '/dev',
  handler: async (request, h) => {
    return h.file(`${rootDir}/index.html`);
  }
}