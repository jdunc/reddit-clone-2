exports.config = {
  framework: 'jasmine',
  capabilities:{
    'browserName': 'chrome'
  },
  directConnect: true,
  specs: ['*.test.js'],
  onPrepare: function () {
    const path = require('path')
    const http = require('http')
    const express = require('express')
    const basePath = path.join(__dirname, '/../')

    const app = express()
      .use(express.static(basePath))
      .get('*', (_, res) => res.sendFile( path.join(basePath, 'index.html') ))

    const server = http.createServer(app)
    server.listen(0)
    browser.baseUrl = 'http://localhost:' + server.address().port
  }
}
