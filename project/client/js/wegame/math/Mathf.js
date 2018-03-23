export default class Mathf {
  static EPSILON = 0.000001
  static DEG2RAD = 0.0174533
  static RAD2DEG = 57.2958

  static IsFloatEqual(a, b) {
    return Math.abs(a - b) < Mathf.EPSILON
  }

  static IsFloatZero(a) {
    return Mathf.IsFloatEqual(a, 0)
  }
}
