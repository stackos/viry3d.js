export default class Shader {
  static shaders = new Map()

  static Find(name) {
    let shader = Shader.shaders.get(name)
    if (shader == null) {
      shader = new Shader()
      shader.load('./shader/' + name + '.js')
      shader.compile()

      Shader.shaders.set(name, shader)
    }

    return shader
  }

  constructor() {

  }

  load(path) {
    let req = require(path)
    if (req != null && req.default != null) {
      this.passes = req.default
    } else {
      console.log('load shader error: ' + path)
    }
  }

  compile() {
    if (this.passes == null) {
      return
    }

    for (let i = 0; i < this.passes.length; ++i) {
      let pass = this.passes[i]

      let vs = Shader.CreateGLShader(pass.vs, gl.VERTEX_SHADER)
      let fs = Shader.CreateGLShader(pass.fs, gl.FRAGMENT_SHADER)

      if (vs != null && fs != null) {
        let program = gl.createProgram()

        gl.attachShader(program, vs)
        gl.attachShader(program, fs)

        gl.linkProgram(program)

        gl.deleteShader(vs)
        gl.deleteShader(fs)

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          let info = gl.getProgramInfoLog(program)
          console.error('Could not link WebGL program. \n\n' + info)
          gl.deleteProgram(program)
          continue
        }

        pass.program = program
      }

      if (pass.rs == null) {
        pass.rs = { }
      }

      let rs = pass.rs

      if (rs.Cull == null) {
        rs.Cull = gl.BACK
      }

      if (rs.ZTest == null) {
        rs.ZTest = gl.LEQUAL
      }

      if (rs.ZWrite == null) {
        rs.ZWrite = 1
      }

      if (rs.Blend == null) {
        rs.Blend = 0
      }

      if (rs.Blend == 1) {
        if (rs.SrcBlendMode == null) {
          rs.SrcBlendMode = gl.SRC_ALPHA
        }

        if (rs.DstBlendMode == null) {
          rs.DstBlendMode = gl.ONE_MINUS_SRC_ALPHA
        }
      }
    }
  }

  getPassCount() {
    return this.passes.length
  }

  getProgram(pass) {
    return this.passes[pass].program
  }

  applyRenderStates(pass) {
    let rs = this.passes[pass].rs

    if (rs.Cull == 0) {
      gl.disable(gl.CULL_FACE)
    } else {
      gl.enable(gl.CULL_FACE)
      gl.cullFace(rs.Cull)
      gl.frontFace(gl.CCW)
    }

    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(rs.ZTest)
    gl.depthMask(rs.ZWrite)

    if (rs.Blend == 0) {
      gl.disable(gl.BLEND)
    } else {
      gl.enable(gl.BLEND)
      gl.blendFunc(rs.SrcBlendMode, rs.DstBlendMode)
    }
  }

  static CreateGLShader(src, type) {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      let info = gl.getShaderInfoLog(shader)
      console.error('Could not compile WebGL shader. \n\n' + info)
      gl.deleteShader(shader)
      return null
    }
    return shader
  }
}
