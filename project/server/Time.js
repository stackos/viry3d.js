class Time {
  static NowString() {
    const date = new Date()
    const time = '[' + date.toLocaleDateString() + '][' + date.toLocaleTimeString() + ']'
    return time
  }

  static Now() {
    return Date.now()
  }
}

global.Time = Time
