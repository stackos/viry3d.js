import Node from '../Node'
import Vector3 from '../math/Vector3'
import Matrix4 from '../math/Matrix4'

export default class Camera extends Node {
  constructor(targetWidth, targetHeight) {
    super()

    this.targetWidth = targetWidth
    this.targetHeight = targetHeight
    this.viewportRect = {
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    }
    this.clearColor = {
      r: 1,
      g: 1,
      b: 1,
      a: 1,
    }
    this.fov = 45
    this.near = 0.3
    this.far = 1000
    this.matrixDirty = true
  }

  setViewportRect(x, y, w, h) {
    this.viewportRect.x = x
    this.viewportRect.y = y
    this.viewportRect.w = w
    this.viewportRect.h = h
  }

  setClearColor(r, g, b, a) {
    this.clearColor.r = r
    this.clearColor.g = g
    this.clearColor.b = b
    this.clearColor.a = a
  }

  setFov(fov) {
    this.fov = fov
    this.matrixDirty = true
  }

  setNear(near) {
    this.near = near
    this.matrixDirty = true
  }

  setFar(far) {
    this.far = far
    this.matrixDirty = true
  }

  updateMatrix() {
    if (this.matrixDirty) {
      this.matrixDirty = false
      
      let pos = this.getPosition()
      let forward = this.getForward()
      let up = this.getUp()

      this.viewMatrix = Matrix4.LookTo(pos, forward, up)
      this.projectionMatrix = Matrix4.Perspective(this.fov, this.targetWidth / this.targetHeight, this.near, this.far)
    }
  }

  getViewMatrix() {
    this.updateMatrix()
    return this.viewMatrix.copy()
  }

  getProjectionMatrix() {
    this.updateMatrix()
    return this.projectionMatrix.copy()
  }

  clearTarget() {
    gl.viewport(
      this.viewportRect.x * this.targetWidth,
      this.viewportRect.y * this.targetHeight,
      this.viewportRect.w * this.targetWidth,
      this.viewportRect.h * this.targetHeight)
    gl.clearColor(
      this.clearColor.r,
      this.clearColor.g,
      this.clearColor.b,
      this.clearColor.a)
    gl.clearDepth(1)
    gl.colorMask(true, true, true, true)
    gl.depthMask(true)
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
  }
}
