import Mathf from './Mathf'
import Vector3 from './Vector3'

export default class Matrix4 {
  constructor() {
    this.array = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]
  }

  get data() {
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

  static Translation(x, y, z) {
    let m = new Matrix4()

    m.array[3] = x
		m.array[7] = y
    m.array[11] = z

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

  static Scaling(x, y, z) {
    let m = new Matrix4()

    m.array[0] = x
		m.array[5] = y
		m.array[11] = z

    return m
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
