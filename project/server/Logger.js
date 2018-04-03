const fs = require('fs')

class Logger {
  constructor() {
    this.rl = null

    if (fs.existsSync('logs') == false) {
      fs.mkdirSync('logs')
    }
    this.file = fs.openSync('logs/log' + Time.NowString().replace(/:/g, '\'') + '.txt', 'w')
  }

  log(tag, str) {
    const log = Time.NowString() + '[' + tag + ']: ' + str

    fs.writeSync(this.file, log + '\r\n', null, 'utf8')
    console.log(log)

    if (this.rl) {
      this.rl.prompt()
    }
  }
}

global.Logger = new Logger()
