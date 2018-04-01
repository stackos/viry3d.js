const URL = require('url')

class Message {
  constructor(request, response) {
    this.request = request
    this.response = response
    const url = URL.parse(request.url, true)
    this.path = url.pathname
    this.query = url.query
    this.result = { }
  }

  endResponse() {
    this.response.writeHead(200, { 'Content-Type': 'text/json' })
    this.response.end(JSON.stringify(this.result))
  }
}

module.exports = Message
