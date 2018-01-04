module.exports = {
  method: 'GET',
  path: '/dev',
  handler: async (request, h) => {
    return h.view('index', {
      port: process.env.PORT || 5000
    });
  }
}
