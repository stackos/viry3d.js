const url = require('url')

class Message {
  constructor(request, response) {
    this.request = request
    this.response = response
    this.path = url.parse(request.url).pathname
    this.result = {}
  }

  endResponse() {
    this.response.writeHead(200, { 'Content-Type': 'text/json' })
    this.response.end(JSON.stringify(this.result))
  }
}

module.exports = Message
