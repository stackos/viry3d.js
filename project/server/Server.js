require('./Time')
require('./Logger')
const http = require('http')
const Router = require('./Router')
const Message = require('./Message')
const controller = require('./controller')

const TAG = 'Server'

class Server {
  constructor() {
    this.router = new Router()
    this.router.add('/login', controller.login)
  }

  run(port) {
    http.createServer((request, response) => {
      this.router.route(new Message(request, response))
    }).listen(port)

    Logger.log(TAG, 'Server running at port ' + port)
  }
}

new Server().run(80)
