import Shader from './Shader'

const PropertyType = {
  Int: 0,
  Float: 1,
  Vector: 2,
  Matrix: 3,
  Color: 4,
  Texture2D: 5,
}

export default class Material {
  static Create(shaderName) {
    let shader = Shader.Find(shaderName)
    if (shader != null) {
      return new Material(shader)
    }

    return null
  }

  constructor(shader) {
    this.shader = shader
    this.properties = new Map()
  }

  setMatrix(name, matrix) {
    this.properties.set(name, {
      type: PropertyType.Matrix,
      value: matrix,
    })
  }

  setTexture2D(name, texture) {
    this.properties.set(name, {
      type: PropertyType.Texture2D,
      value: texture
    })
  }

  getShader() {
    return this.shader
  }

  apply(pass) {
    let program = this.shader.getProgram(pass)
    gl.useProgram(program)

    let textureIndex = 0
    for (let [name, property] of this.properties) {
      let loc = gl.getUniformLocation(program, name)
      if (loc != null) {
        switch (property.type) {
          case PropertyType.Matrix:
            gl.uniformMatrix4fv(loc, false, property.value)
            break
          case PropertyType.Texture2D:
            gl.activeTexture(gl.TEXTURE0 + textureIndex)
            gl.bindTexture(gl.TEXTURE_2D, property.value.getTexture())
            gl.uniform1i(loc, textureIndex)
            textureIndex++
            break
        }
      }
    }

    this.shader.applyRenderStates(pass)
  }
}
