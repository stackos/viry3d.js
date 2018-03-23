import Mathf from './Mathf'

export default class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  copy(v = null) {
    if (v == null) {
      return new Vector2().copy(this)
    } else {
      this.x = v.x
      this.y = v.y

      return this
    }
  }

  sqrLength() {
    return this.x * this.x + this.y * this.y
  }

  length() {
    return Math.sqrt(this.sqrLength())
  }

  normalize() {
    let sqr = this.sqrLength()
		if (!Mathf.IsFloatZero(sqr)) {
			let inv = 1.0 / Math.sqrt(sqr)

			this.x = this.x * inv
			this.y = this.y * inv
		}
  }

  normalized() {
    let v = this.copy()
    v.normalize()
    return v
  }
}
