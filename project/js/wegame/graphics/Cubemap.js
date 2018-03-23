import Texture from './Texture'

export default class Cubemap extends Texture {
  constructor(width, height, filterMode = gl.LINEAR, wrapMode = gl.CLAMP_TO_EDGE, mipmap = true) {
    super(gl.TEXTURE_CUBE_MAP, width, height, filterMode, wrapMode, mipmap)
  }

  setImage(face, image, level) {
    gl.bindTexture(this.target, this.getTexture())
    gl.texImage2D(face, level, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    gl.bindTexture(this.target, null)
  }
}
