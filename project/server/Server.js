let http = require('http')
let Router = require('./Router')
let Message = require('./Message')
let controller = require('./controller')

class Server {
  constructor() {
    this.router = new Router()
    this.router.add('/login', controller.login)
  }

  run(port) {
    http.createServer((request, response) => {
      this.router.route(new Message(request, response))
    }).listen(port)

    console.log('Server running at port ' + port)
  }
}

new Server().run(80)
