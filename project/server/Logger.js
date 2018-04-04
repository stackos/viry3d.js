const fs = require('fs')
const Time = require('./Time')

class Logger {
  static Init() {
    Logger.rl = null

    if (fs.existsSync('logs') == false) {
      fs.mkdirSync('logs')
    }
    Logger.file = fs.openSync('logs/log' + Time.NowString().replace(/:/g, '\'') + '.txt', 'w')
  }

  static Release() {
    fs.closeSync(Logger.file)
    Logger.file = null
  }

  static Log(tag, str) {
    const log = Time.NowString() + '[' + tag + ']: ' + str

    fs.writeSync(Logger.file, log + '\r\n', null, 'utf8')
    console.log(log)

    if (Logger.rl) {
      Logger.rl.prompt()
    }
  }
}

module.exports = Logger
