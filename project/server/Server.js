require('./Time')
require('./Logger')
const http = require('http')
const readline = require('readline')
const Router = require('./Router')
const Message = require('./Message')
const DB = require('./DB')
const Game = require('./Game')
const controller = require('./controller')

const TAG = 'Server'

class Server {
  constructor(port) {
    this.port = port

    this.router = new Router()
    this.router.add('/register', controller.register)
    this.router.add('/login', controller.login)

    this.db = new DB()
    this.game = new Game()

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    this.rl.prompt()
    Logger.rl = this.rl

    this.rl.on('line', (line) => {
      switch (line) {
        case 'shutdown':
          this.rl.close()
          break
        default:
          this.rl.prompt()
          break
      }
    }).on('close', () => {
      this.rl = null
      Logger.rl = null

      this.shutdown()
    })
  }

  startup() {
    this.server = http.createServer((request, response) => {
      this.router.route(this, new Message(request, response))
    }).listen(this.port)

    Logger.log(TAG, 'Server running at port ' + this.port)
  }

  shutdown() {
    Logger.log(TAG, 'Server closing')

    this.server.close(() => {
      this.server = null
      Logger.log(TAG, 'Server closed')

      process.exit(0)
    })
  }
}

const server = new Server(80)
server.startup()
