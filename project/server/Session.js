const Time = require('./Time')

class Session {
  constructor(token, id) {
    this.token = token
    this.id = id
    this.time = Time.Now()
  }

  updateTime() {
    this.time = Time.Now()
  }

  getToken() {
    return this.token
  }
}

module.exports = Session
