const Logger = require('./Logger')

const TAG = 'Router'

class Router {
  constructor() {
    this.msgMap = new Map()
  }

  add(path, handler) {
    this.msgMap.set(path, handler)
  }

  route(server, msg) {
    const handler = this.msgMap.get(msg.path)
    if (handler) {
      handler(server, msg)
    } else {
      Logger.Log(TAG, 'Query path has no handler: ' + msg.path)
      msg.endResponse()
    }
  }
}

module.exports = Router
