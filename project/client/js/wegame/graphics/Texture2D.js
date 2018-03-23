import Texture from './Texture'

export default class Texture2D extends Texture {
  constructor(width, height, filterMode = gl.LINEAR, wrapMode = gl.CLAMP_TO_EDGE, mipmap = true) {
    super(gl.TEXTURE_2D, width, height, filterMode, wrapMode, mipmap)
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

  static GetDefaultBlackTexture() {
    if (Texture2D.defaultBlackTexture == null) {
      Texture2D.defaultBlackTexture = new Texture2D(1, 1)
      Texture2D.defaultBlackTexture.setPixels(new Uint8Array([0, 0, 0, 255]))
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

  static GetBrdfLUT() {
    return new Promise((resolve, reject) => {
      if (Texture2D.brdfLUT == null) {
        Resources.LoadTexture2D('assets/texture/brdfLUT.png', gl.LINEAR, gl.CLAMP_TO_EDGE, false)
          .then(tex => {
            Texture2D.brdfLUT = tex
            resolve(tex)
          })
          .catch(error => {
            reject(error)
          })
      } else {
        resolve(Texture2D.brdfLUT)
      }
    })
  }
}
