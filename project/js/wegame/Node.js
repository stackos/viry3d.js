import Vector3 from "./math/Vector3"
import Quaternion from "./math/Quaternion"
import Matrix4 from './math/Matrix4'

export default class Node {
  constructor() {
    this.parent = null
    this.children = new Array()
    this.localPosition = new Vector3(0, 0, 0)
    this.localRotation = new Quaternion(0, 0, 0, 1)
    this.localScale = new Vector3(1, 1, 1)
    this.transformDirty = true
    this.position = new Vector3(0, 0, 0)
    this.rotation = new Quaternion(0, 0, 0, 1)
    this.scale = new Vector3(1, 1, 1)
  }

  setLocalPosition(pos) {
    this.localPosition.x = pos.x
    this.localPosition.y = pos.y
    this.localPosition.z = pos.z
    this.transformDirty = true
  }

  setLocalRotation(rot) {
    this.localRotation.x = rot.x
    this.localRotation.y = rot.y
    this.localRotation.z = rot.z
    this.localRotation.w = rot.w
    this.transformDirty = true
  }

  setLocalScale(scale) {
    this.localScale.x = scale.x
    this.localScale.y = scale.y
    this.localScale.z = scale.z
    this.transformDirty = true
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

  updateTransform() {
    if (this.transformDirty) {
      this.transformDirty = false

      if (this.parent != null) {

      } else {
        this.position.copy(this.localPosition)
        this.rotation.copy(this.localRotation)
        this.scale.copy(this.localScale)

        this.localToWorldMatrix = Matrix4.TRS(this.position.copy(), this.rotation.copy(), this.scale.copy())
        this.worldToLocalMatrix = this.localToWorldMatrix.inversed()
      }
    }
  }

  getPosition() {
    this.updateTransform()
    return this.position.copy()
  }

  getRotation() {
    this.updateTransform()
    return this.rotation.copy()
  }

  getScale() {
    this.updateTransform()
    return this.scale.copy()
  }

  getLocalToWorldMatrix() {
    this.updateTransform()
    return this.localToWorldMatrix.copy()
  }

  getWorldToLocalMatrix() {
    this.updateTransform()
    return this.worldToLocalMatrix.copy()
  }

  getRight() {
    return this.getRotation().multiplyVector3(new Vector3(1, 0, 0))
  }

  getUp() {
    return this.getRotation().multiplyVector3(new Vector3(0, 1, 0))
  }

  getForward() {
    return this.getRotation().multiplyVector3(new Vector3(0, 0, 1))
  }
}
