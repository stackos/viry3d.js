import Mathf from './Mathf'

export default class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  copy(v = null) {
    if (v == null) {
      return new Vector3().copy(this)
    } else {
      this.x = v.x
      this.y = v.y
      this.z = v.z

      return this
    }
  }

  sqrLength() {
    return this.x * this.x + this.y * this.y + this.z * this.z
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
			this.z = this.z * inv
		}
  }

  normalized() {
    let v = this.copy()
    v.normalize()
    return v
  }

  cross(v) {
    let x = this.y * v.z - this.z * v.y
		let y = this.z * v.x - this.x * v.z
    let z = this.x * v.y - this.y * v.x

		return new Vector3(x, y, z)
  }

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }
}
