import Mathf from './Mathf'

export default class Vector4 {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  copy(v = null) {
    if (v == null) {
      return new Vector4().copy(this)
    } else {
      this.x = v.x
      this.y = v.y
      this.z = v.z
      this.w = v.w

      return this
    }
  }
}
