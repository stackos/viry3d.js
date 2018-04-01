require('./Time')
require('./Logger')
const http = require('http')
const Router = require('./Router')
const Message = require('./Message')
const controller = require('./controller')
const DB = require('./DB')

const TAG = 'Server'

class Server {
  constructor(port) {
    this.port = port

    this.router = new Router()
    this.router.add('/register', controller.register)
    this.router.add('/login', controller.login)

    this.db = new DB()
  }

  start() {
    http.createServer((request, response) => {
      this.router.route(this, new Message(request, response))
    }).listen(this.port)

    Logger.log(TAG, 'Server running at port ' + this.port)
  }
}

const server = new Server(80)
server.start()
