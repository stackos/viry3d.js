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
    if (req != null && req.default != null && req.default.passes != null) {
      this.passes = req.default.passes
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
    }
  }

  getPassCount() {
    return this.passes.length
  }

  getProgram(pass) {
    return this.passes[pass].program
  }

  applyRenderStates(pass) {

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
