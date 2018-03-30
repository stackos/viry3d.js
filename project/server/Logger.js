const fs = require('fs')

class Logger {
  constructor() {
    if (fs.existsSync('logs') == false) {
      fs.mkdirSync('logs')
    }
    this.file = fs.openSync('logs/log' + Time.NowString().replace(/:/g, '\'') + '.txt', 'w')
  }

  log(tag, str) {
    const log = Time.NowString() + '[' + tag + ']: ' + str

    console.log(log)
    fs.writeSync(this.file, log + '\r\n', null, 'utf8')
  }
}

global.Logger = new Logger()
