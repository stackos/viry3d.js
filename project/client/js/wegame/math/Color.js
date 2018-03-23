import Mathf from './Mathf'

export default class Color {
  constructor(r = 0, g = 0, b = 0, a = 0) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  copy(c = null) {
    if (c == null) {
      return new Color().copy(this)
    } else {
      this.r = c.r
      this.g = c.g
      this.b = c.b
      this.a = c.a

      return this
    }
  }
}
