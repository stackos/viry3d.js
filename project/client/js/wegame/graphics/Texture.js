export default class Texture {
  constructor(target, width, height, filterMode, wrapMode, mipmap) {
    this.target = target
    this.width = width
    this.height = height
    this.filterMode = filterMode
    this.wrapMode = wrapMode
    this.mipmap = mipmap
    this.texture = gl.createTexture()

    gl.bindTexture(this.target, this.getTexture())
    gl.texParameterf(this.target, gl.TEXTURE_MAG_FILTER, filterMode)
    if (mipmap) {
      if (filterMode == gl.NEAREST) {
        gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST)
      } else if (filterMode == gl.LINEAR) {
        gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      }
    } else {
      gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, filterMode)
    }

    gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, wrapMode)
    gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, wrapMode)

    gl.bindTexture(this.target, null)
  }

  getTarget() {
    return this.target
  }

  getWidth() {
    return this.width
  }

  getHeight() {
    return this.height
  }

  getFilterMode() {
    return this.filterMode
  }

  getWrapMode() {
    return this.wrapMode
  }

  isMipmap() {
    return this.mipmap
  }

  getTexture() {
    return this.texture
  }
}
