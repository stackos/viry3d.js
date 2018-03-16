export default class Texture {
  constructor(width, height, filterMode, wrapMode, mipmap) {
    this.width = width
    this.height = height
    this.filterMode = filterMode
    this.wrapMode = wrapMode
    this.mipmap = mipmap
    this.texture = gl.createTexture()
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
