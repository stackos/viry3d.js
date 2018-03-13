import Vector3 from "./math/Vector3"
import Quaternion from "./math/Quaternion"

export default class Node {
  constructor() {
    this.parent = null
    this.children = new Array()
    this.localPosition = new Vector3(0, 0, 0)
    this.localRotation = new Quaternion(0, 0, 0, 1)
    this.localScale = new Vector3(1, 1, 1)
  }

  setLocalPosition(x, y, z) {
    this.localPosition.x = x
    this.localPosition.y = y
    this.localPosition.z = z
    this.matrixDirty = true
  }

  setLocalRotation(x, y, z) {
    this.localRotation = Quaternion.Euler(x, y, z)
    this.matrixDirty = true
  }

  setLocalScale(x, y, z) {
    this.localScale.x = x
    this.localScale.y = y
    this.localScale.z = z
    this.matrixDirty = true
  }

  getLocalPosition() {
    return this.localPosition.copy()
  }

  getLocalRotation() {
    return this.localRotation.copy()
  }

  getLocalScale() {
    return this.localScale.copy()
  }

  updateMatrix() {
    if (this.matrixDirty) {
      this.matrixDirty = false
    }
  }

  getPosition() {
    this.updateMatrix()
  }

  getRotation() {
    this.updateMatrix()
  }

  getScale() {
    this.updateMatrix()
  }

  getLocalToWorldMatrix() {
    this.updateMatrix()
  }
}
