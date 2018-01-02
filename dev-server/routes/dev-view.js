const path = require('path')
module.exports = {
  method: 'GET',
  path: '/dev',
  handler: async (request, h) => {
    return h.file(path.join(__dirname, '/../index.html'))
  }
}
