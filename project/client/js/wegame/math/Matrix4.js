import Mathf from './Mathf'
import Vector3 from './Vector3'

export default class Matrix4 {
  constructor() {
    this.array = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ])
  }

  copy(m = null) {
    if (m == null) {
      return new Matrix4().copy(this)
    } else {
      for (let i = 0; i < this.array.length; ++i) {
        this.array[i] = m.array[i]
      }
      return this
    }
  }

  data() {
    return this.array
  }

  multiply(mat) {
    let m = new Matrix4()

    m.array[0] = this.array[0] * mat.array[0] + this.array[1] * mat.array[4] + this.array[2] * mat.array[8] + this.array[3] * mat.array[12]
    m.array[1] = this.array[0] * mat.array[1] + this.array[1] * mat.array[5] + this.array[2] * mat.array[9] + this.array[3] * mat.array[13]
    m.array[2] = this.array[0] * mat.array[2] + this.array[1] * mat.array[6] + this.array[2] * mat.array[10] + this.array[3] * mat.array[14]
    m.array[3] = this.array[0] * mat.array[3] + this.array[1] * mat.array[7] + this.array[2] * mat.array[11] + this.array[3] * mat.array[15]

    m.array[4] = this.array[4] * mat.array[0] + this.array[5] * mat.array[4] + this.array[6] * mat.array[8] + this.array[7] * mat.array[12]
    m.array[5] = this.array[4] * mat.array[1] + this.array[5] * mat.array[5] + this.array[6] * mat.array[9] + this.array[7] * mat.array[13]
    m.array[6] = this.array[4] * mat.array[2] + this.array[5] * mat.array[6] + this.array[6] * mat.array[10] + this.array[7] * mat.array[14]
    m.array[7] = this.array[4] * mat.array[3] + this.array[5] * mat.array[7] + this.array[6] * mat.array[11] + this.array[7] * mat.array[15]

    m.array[8] = this.array[8] * mat.array[0] + this.array[9] * mat.array[4] + this.array[10] * mat.array[8] + this.array[11] * mat.array[12]
    m.array[9] = this.array[8] * mat.array[1] + this.array[9] * mat.array[5] + this.array[10] * mat.array[9] + this.array[11] * mat.array[13]
    m.array[10] = this.array[8] * mat.array[2] + this.array[9] * mat.array[6] + this.array[10] * mat.array[10] + this.array[11] * mat.array[14]
    m.array[11] = this.array[8] * mat.array[3] + this.array[9] * mat.array[7] + this.array[10] * mat.array[11] + this.array[11] * mat.array[15]

    m.array[12] = this.array[12] * mat.array[0] + this.array[13] * mat.array[4] + this.array[14] * mat.array[8] + this.array[15] * mat.array[12]
    m.array[13] = this.array[12] * mat.array[1] + this.array[13] * mat.array[5] + this.array[14] * mat.array[9] + this.array[15] * mat.array[13]
    m.array[14] = this.array[12] * mat.array[2] + this.array[13] * mat.array[6] + this.array[14] * mat.array[10] + this.array[15] * mat.array[14]
    m.array[15] = this.array[12] * mat.array[3] + this.array[13] * mat.array[7] + this.array[14] * mat.array[11] + this.array[15] * mat.array[15]

    return m
  }

  multiplyPoint(v) {
    let x = v.x
    let y = v.y
    let z = v.z

    let vx = x * this.array[0] + y * this.array[1] + z * this.array[2] + this.array[3]
    let vy = x * this.array[4] + y * this.array[5] + z * this.array[6] + this.array[7]
    let vz = x * this.array[8] + y * this.array[9] + z * this.array[10] + this.array[11]
    let vw = x * this.array[12] + y * this.array[13] + z * this.array[14] + this.array[15]

    return new Vector3(vx / vw, vy / vw, vz / vw)
  }

  multiplyPoint3x4(v) {
    let x = v.x
    let y = v.y
    let z = v.z

    let vx = x * this.array[0] + y * this.array[1] + z * this.array[2] + this.array[3]
    let vy = x * this.array[4] + y * this.array[5] + z * this.array[6] + this.array[7]
    let vz = x * this.array[8] + y * this.array[9] + z * this.array[10] + this.array[11]

    return new Vector3(vx, vy, vz)
  }

  multiplyDirection(v) {
    let x = v.x
    let y = v.y
    let z = v.z

    let vx = x * this.array[0] + y * this.array[1] + z * this.array[2]
    let vy = x * this.array[4] + y * this.array[5] + z * this.array[6]
    let vz = x * this.array[8] + y * this.array[9] + z * this.array[10]

    return new Vector3(vx, vy, vz)
  }

  determinant() {
    let m0 = this.array[0]; let m1 = this.array[4]; let m2 = this.array[8]; let m3 = this.array[12]
    let m4 = this.array[1]; let m5 = this.array[5]; let m6 = this.array[9]; let m7 = this.array[13]
    let m8 = this.array[2]; let m9 = this.array[6]; let m10 = this.array[10]; let m11 = this.array[14]
    let m12 = this.array[3]; let m13 = this.array[7]; let m14 = this.array[11]; let m15 = this.array[15]

    return (
      m12 * m9 * m6 * m3    - m8 * m13 * m6 * m3    - m12 * m5 * m10 * m3   + m4 * m13 * m10 * m3   +
      m8 * m5 * m14 * m3    - m4 * m9 * m14 * m3    - m12 * m9 * m2 * m7    + m8 * m13 * m2 * m7    +
      m12 * m1 * m10 * m7   - m0 * m13 * m10 * m7   - m8 * m1 * m14 * m7    + m0 * m9 * m14 * m7    +
      m12 * m5 * m2 * m11   - m4 * m13 * m2 * m11   - m12 * m1 * m6 * m11   + m0 * m13 * m6 * m11   +
      m4 * m1 * m14 * m11   - m0 * m5 * m14 * m11   - m8 * m5 * m2 * m15    + m4 * m9 * m2 * m15    +
      m8 * m1 * m6 * m15    - m0 * m9 * m6 * m15    - m4 * m1 * m10 * m15   + m0 * m5 * m10 * m15)
  }

  inversed() {
    let m = new Matrix4()

    let d = this.determinant()
    if (Math.abs(d) < Number.EPSILON) {
      return m
    }

    let m0 = this.array[0]; let m1 = this.array[4]; let m2 = this.array[8]; let m3 = this.array[12]
    let m4 = this.array[1]; let m5 = this.array[5]; let m6 = this.array[9]; let m7 = this.array[13]
    let m8 = this.array[2]; let m9 = this.array[6]; let m10 = this.array[10]; let m11 = this.array[14]
    let m12 = this.array[3]; let m13 = this.array[7]; let m14 = this.array[11]; let m15 = this.array[15]

    let s = 1.0 / d

    m.array[0] = (m9*m14*m7   -m13*m10*m7     +m13*m6*m11     -m5*m14*m11     -m9*m6*m15      +m5*m10*m15) * s
    m.array[4] = (m13*m10*m3  -m9*m14*m3      -m13*m2*m11     +m1*m14*m11     +m9*m2*m15      -m1*m10*m15) * s
    m.array[8] = (m5*m14*m3   -m13*m6*m3      +m13*m2*m7      -m1*m14*m7      -m5*m2*m15      +m1*m6*m15) * s
    m.array[12] = (m9*m6*m3   -m5*m10*m3      -m9*m2*m7       +m1*m10*m7      +m5*m2*m11      -m1*m6*m11) * s

    m.array[1] = (m12*m10*m7  -m8*m14*m7      -m12*m6*m11     +m4*m14*m11     +m8*m6*m15      -m4*m10*m15) * s
    m.array[5] = (m8*m14*m3   -m12*m10*m3     +m12*m2*m11     -m0*m14*m11     -m8*m2*m15      +m0*m10*m15) * s
    m.array[9] = (m12*m6*m3   -m4*m14*m3      -m12*m2*m7      +m0*m14*m7      +m4*m2*m15      -m0*m6*m15) * s
    m.array[13] = (m4*m10*m3  -m8*m6*m3       +m8*m2*m7       -m0*m10*m7      -m4*m2*m11      +m0*m6*m11) * s

    m.array[2] = (m8*m13*m7   -m12*m9*m7      +m12*m5*m11     -m4*m13*m11     -m8*m5*m15      +m4*m9*m15) * s
    m.array[6] = (m12*m9*m3   -m8*m13*m3      -m12*m1*m11     +m0*m13*m11     +m8*m1*m15      -m0*m9*m15) * s
    m.array[10] = (m4*m13*m3  -m12*m5*m3      +m12*m1*m7      -m0*m13*m7      -m4*m1*m15      +m0*m5*m15) * s
    m.array[14] = (m8*m5*m3   -m4*m9*m3       -m8*m1*m7       +m0*m9*m7       +m4*m1*m11      -m0*m5*m11) * s

    m.array[3] = (m12*m9*m6   -m8*m13*m6      -m12*m5*m10     +m4*m13*m10     +m8*m5*m14      -m4*m9*m14) * s
    m.array[7] = (m8*m13*m2   -m12*m9*m2      +m12*m1*m10     -m0*m13*m10     -m8*m1*m14      +m0*m9*m14) * s
    m.array[11] = (m12*m5*m2  -m4*m13*m2      -m12*m1*m6      +m0*m13*m6      +m4*m1*m14      -m0*m5*m14) * s
    m.array[15] = (m4*m9*m2   -m8*m5*m2       +m8*m1*m6       -m0*m9*m6       -m4*m1*m10      +m0*m5*m10) * s

    return m
  }

  tranposed() {
    let m = new Matrix4()

    m.array[0] = this.array[0]; m.array[1] = this.array[4]; m.array[2] = this.array[8]; m.array[3] = this.array[12]
    m.array[4] = this.array[1]; m.array[5] = this.array[5]; m.array[6] = this.array[9]; m.array[7] = this.array[13]
    m.array[8] = this.array[2]; m.array[9] = this.array[6]; m.array[10] = this.array[10]; m.array[11] = this.array[14]
    m.array[12] = this.array[3]; m.array[13] = this.array[7]; m.array[14] = this.array[11]; m.array[15] = this.array[15]

    return m
  }

  static Translation(t) {
    let m = new Matrix4()

    m.array[3] = t.x
    m.array[7] = t.y
    m.array[11] = t.z

    return m
  }

  static Rotation(r) {
    let m = new Matrix4()

    m.array[0] = 1 - 2 * r.y * r.y - 2 * r.z * r.z
		m.array[4] = 2 * r.x * r.y + 2 * r.w * r.z
		m.array[8] = 2 * r.x * r.z - 2 * r.w * r.y

		m.array[1] = 2 * r.x * r.y - 2 * r.w * r.z
		m.array[5] = 1 - 2 * r.x * r.x - 2 * r.z * r.z
		m.array[9] = 2 * r.y * r.z + 2 * r.w * r.x

		m.array[2] = 2 * r.x * r.z + 2 * r.w * r.y
		m.array[6] = 2 * r.y * r.z - 2 * r.w * r.x
    m.array[10] = 1 - 2 * r.x * r.x - 2 * r.y * r.y

    return m
  }

  static Scaling(s) {
    let m = new Matrix4()

    m.array[0] = s.x
    m.array[5] = s.y
    m.array[10] = s.z

    return m
  }

  static TRS(t, r, s) {
    let mt = Matrix4.Translation(t)
    let mr = Matrix4.Rotation(r)
    let ms = Matrix4.Scaling(s)
    return mt.multiply(mr).multiply(ms)
  }

  static LookTo(eye, forward, up) {
    let m = new Matrix4()

    let zaxis = new Vector3(-forward.x, -forward.y, -forward.z)
    zaxis.normalize()

    let xaxis = zaxis.cross(up)
    xaxis.normalize()

    let yaxis = xaxis.cross(zaxis)

		m.array[0] = xaxis.x;	m.array[1] = xaxis.y;	m.array[2] = xaxis.z;	  m.array[3] = -xaxis.dot(eye)
		m.array[4] = yaxis.x;	m.array[5] = yaxis.y;	m.array[6] = yaxis.z;	  m.array[7] = -yaxis.dot(eye)
		m.array[8] = zaxis.x;	m.array[9] = zaxis.y;	m.array[10] = zaxis.z;	m.array[11] = -zaxis.dot(eye)

    return m
  }

  static Perspective(fov, aspect, near, far) {
    let m = new Matrix4()

    let scale_y = 1 / Math.tan(Mathf.DEG2RAD * fov / 2)
		let scale_x = scale_y / aspect

		m.array[0] = scale_x
		m.array[5] = scale_y
		m.array[10] = (near + far) / (near - far)
		m.array[11] = 2 * near * far / (near - far)
		m.array[14] = -1

    return m
  }

  static Orthographic(left, right, bottom, top, near, far) {
    let m = new Matrix4()

    let r_l = 1 / (right - left)
		let t_b = 1 / (top - bottom)
		let n_f = 1 / (near - far)

		m.array[0] = 2 * r_l
		m.array[3] = -(right + left) * r_l
		m.array[5] = 2 * t_b
		m.array[7] = -(top + bottom) * t_b
		// cvv 0~1
		m.array[10] = n_f
		m.array[11] = near * n_f

    return m
  }
}
