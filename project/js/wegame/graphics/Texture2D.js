import Texture from './Texture'

export default class Texture2D extends Texture {
  constructor(width, height, filterMode = gl.LINEAR, wrapMode = gl.CLAMP_TO_EDGE, mipmap = true) {
    super(width, height, filterMode, wrapMode, mipmap)
    this.target = gl.TEXTURE_2D

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

  setImage(image) {
    gl.bindTexture(this.target, this.getTexture())
    gl.texImage2D(this.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    if (this.isMipmap()) {
      gl.generateMipmap(this.target)
    }

    gl.bindTexture(this.target, null)
  }

  setPixels(pixels) {
    gl.bindTexture(this.target, this.getTexture())
    gl.texImage2D(this.target, 0, gl.RGBA, this.getWidth(), this.getHeight(), 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

    if (this.isMipmap()) {
      gl.generateMipmap(this.target)
    }

    gl.bindTexture(this.target, null)
  }

  static GetDefaultWhiteTexture() {
    if (Texture2D.defaultWhiteTexture == null) {
      Texture2D.defaultWhiteTexture = new Texture2D(1, 1)
      Texture2D.defaultWhiteTexture.setPixels(new Uint8Array([255, 255, 255, 255]))
    }

    return Texture2D.defaultWhiteTexture
  }

  static GetDefaultNormalTexture() {
    if (Texture2D.defaultNormalTexture == null) {
      Texture2D.defaultNormalTexture = new Texture2D(1, 1)
      Texture2D.defaultNormalTexture.setPixels(new Uint8Array([128, 128, 255, 255]))
    }

    return Texture2D.defaultNormalTexture
  }
}
