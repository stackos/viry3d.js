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

  setParent(parent) {
    let pos = this.getPosition()
    let rot = this.getRotation()
    let scale = this.getScale()

    if (this.parent != null) {
      this.parent.removeChild(this)
    }
    this.parent = parent
    if (this.parent != null) {
      this.parent.children.push(this)
    }

    this.setPosition(pos)
    this.setRotation(rot)
    this.setScale(scale)
  }

  getParent() {
    return this.parent
  }

  removeChild(child) {
    for (let i = 0; i < this.children.length; ++i) {
      if (this.children[i] == child) {
        this.children.splice(i, 1)
        break
      }
    }
  }

  getChildCount() {
    return this.children.length
  }

  getChild(index) {
    return this.children[index]
  }

  markTransformDirty() {
    this.transformDirty = true

    for (let child of this.children) {
      child.markTransformDirty()
    }
  }

  setLocalPosition(pos) {
    this.localPosition.x = pos.x
    this.localPosition.y = pos.y
    this.localPosition.z = pos.z
    this.markTransformDirty()
  }

  setLocalRotation(rot) {
    this.localRotation.x = rot.x
    this.localRotation.y = rot.y
    this.localRotation.z = rot.z
    this.localRotation.w = rot.w
    this.markTransformDirty()
  }

  setLocalScale(scale) {
    this.localScale.x = scale.x
    this.localScale.y = scale.y
    this.localScale.z = scale.z
    this.markTransformDirty()
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
        this.position.copy(this.parent.getLocalToWorldMatrix().multiplyPoint3x4(this.localPosition))
        this.rotation.copy(this.parent.getRotation().multiply(this.localRotation))

        let parentScale = this.parent.getScale()
        this.scale.x = this.localScale.x * parentScale.x
        this.scale.y = this.localScale.y * parentScale.y
        this.scale.z = this.localScale.z * parentScale.z
      } else {
        this.position.copy(this.localPosition)
        this.rotation.copy(this.localRotation)
        this.scale.copy(this.localScale)
      }

      this.localToWorldMatrix = Matrix4.TRS(this.position.copy(), this.rotation.copy(), this.scale.copy())
      this.worldToLocalMatrix = this.localToWorldMatrix.inversed()
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

  setPosition(pos) {
    if (this.parent == null) {
      this.setLocalPosition(pos)
    } else {
      let local = this.parent.getWorldToLocalMatrix().multiplyPoint3x4(pos)
      this.setLocalPosition(local)
    }
  }

  setRotation(rot) {
    if (this.parent == null) {
      this.setLocalRotation(rot)
    } else {
      let local = this.parent.getRotation().inversed().multiply(rot)
      this.setLocalRotation(local)
    }
  }

  setScale(scale) {
    if (this.parent == null) {
      this.setLocalScale(scale)
    } else {
      let parentScale = this.parent.getScale()
      let x = scale.x / parentScale.x
      let y = scale.y / parentScale.y
      let z = scale.z / parentScale.z
      this.setLocalScale(new Vector3(x, y, z))
    }
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
