import Shader from './Shader'

const PropertyType = {
  Int: 0,
  Float: 1,
  Vector2: 2,
  Vector3: 3,
  Vector4: 4,
  Matrix: 5,
  Color: 6,
  Texture: 7,
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

  setInt(name, i) {
    this.properties.set(name, {
      type: PropertyType.Int,
      value: i,
    })
  }

  setFloat(name, f) {
    this.properties.set(name, {
      type: PropertyType.Float,
      value: f,
    })
  }

  setVector2(name, v) {
    this.properties.set(name, {
      type: PropertyType.Vector2,
      value: v.copy(),
    })
  }

  setVector3(name, v) {
    this.properties.set(name, {
      type: PropertyType.Vector3,
      value: v.copy(),
    })
  }

  setVector4(name, v) {
    this.properties.set(name, {
      type: PropertyType.Vector4,
      value: v.copy(),
    })
  }

  setMatrix(name, matrix) {
    this.properties.set(name, {
      type: PropertyType.Matrix,
      value: matrix.tranposed(),
    })
  }

  setColor(name, color) {
    this.properties.set(name, {
      type: PropertyType.Color,
      value: color.copy()
    })
  }

  setTexture(name, texture) {
    this.properties.set(name, {
      type: PropertyType.Texture,
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
          case PropertyType.Int: {
            gl.uniform1i(loc, property.value)
            break
          }
          case PropertyType.Float: {
            gl.uniform1f(loc, property.value)
            break
          }
          case PropertyType.Vector2: {
            let v = property.value
            gl.uniform2f(loc, v.x, v.y)
            break
          }
          case PropertyType.Vector3: {
            let v = property.value
            gl.uniform3f(loc, v.x, v.y, v.z)
            break
          }
          case PropertyType.Vector4: {
            let v = property.value
            gl.uniform4f(loc, v.x, v.y, v.z, v.w)
            break
          }
          case PropertyType.Matrix: {
            gl.uniformMatrix4fv(loc, false, property.value.data())
            break
          }
          case PropertyType.Color: {
            let color = property.value
            gl.uniform4f(loc, color.r, color.g, color.b, color.a)
            break
          }
          case PropertyType.Texture: {
            let texture = property.value
            gl.activeTexture(gl.TEXTURE0 + textureIndex)
            gl.bindTexture(texture.getTarget(), texture.getTexture())
            gl.uniform1i(loc, textureIndex)
            textureIndex++
            break
          }
        }
      }
    }

    this.shader.applyRenderStates(pass)
  }
}
