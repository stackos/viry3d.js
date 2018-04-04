const http = require('http')
const readline = require('readline')
const crypto = require('crypto')
const Time = require('./Time')
const Logger = require('./Logger')
const Router = require('./Router')
const Message = require('./Message')
const DB = require('./DB')
const Session = require('./Session')
const Game = require('./Game')
const controller = require('./controller')

const TAG = 'Server'

class Server {
  constructor(port) {
    this.port = port

    Logger.Init()

    this.router = new Router()
    this.router.add('/register', controller.register)
    this.router.add('/login', controller.login)

    this.db = new DB()
    this.sessions = new Map()
    this.game = new Game()

    this.initReadLine()
  }

  initReadLine() {
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

    Logger.Log(TAG, 'Server running at port ' + this.port)
  }

  shutdown() {
    Logger.Log(TAG, 'Server closing')

    this.server.close(() => {
      this.server = null
      Logger.Log(TAG, 'Server closed')
      Logger.Release()

      process.exit(0)
    })
  }

  idHash(id) {
    return crypto.createHash('md5').update(id.toString() + '_' + Time.Now().toString()).digest('hex')
  }

  newSession(id) {
    const token = this.idHash(id)
    const session = new Session(token, id)
    this.sessions.delete(token)
    this.sessions.set(token, session)
    return session
  }

  getSession(token) {
    return this.sessions.get(token)
  }
}

new Server(80).startup()
