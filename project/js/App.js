import Application from './wegame/Application'
import Vector3 from './wegame/math/Vector3'
import Quaternion from './wegame/math/Quaternion'
import Matrix4 from './wegame/math/Matrix4'

export default class App extends Application {
  static instance = null

  constructor() {
    super()

    App.instance = this
  }

  init() {
    super.init()

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 1)

    this.createProgram()
    this.createBuffer()
    this.createTexture()

    this.rot = 0
  }

  createProgram() {
    let vss = `
    uniform mat4 uMVP;
    attribute vec4 aPosition;
    attribute vec2 aUV;
    varying vec2 vUV;
    void main()
    {
      gl_Position = aPosition * uMVP;
      vUV = aUV;
    }
    `

    let fss = `
    precision mediump float;
    uniform sampler2D uTexture;
    varying vec2 vUV;
    void main()
    {
      gl_FragColor = texture2D(uTexture, vUV);
    }
    `

    let vs = this.createShader(vss, gl.VERTEX_SHADER)
    let fs = this.createShader(fss, gl.FRAGMENT_SHADER)

    let program = gl.createProgram()

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      let info = gl.getProgramInfoLog(program)
      console.error('Could not link WebGL program. \n\n' + info)
    }

    gl.deleteShader(vs)
    gl.deleteShader(fs)

    this.program = program
  }

  createShader(src, type) {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      let info = gl.getShaderInfoLog(shader)
      console.error('Could not compile WebGL shader. \n\n' + info)
    }
    return shader
  }

  createBuffer() {
    let vertices = new Float32Array([
      -1, 1, 0,   0, 0,
      -1, -1, 0,  0, 1,
      1, -1, 0,   1, 1,
      1, 1, 0,    1, 0,
      ])
    let indices = new Int16Array([0, 1, 2, 0, 2, 3])

    let vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    this.vbo = vbo

    let ibo = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
    this.ibo = ibo
  }

  createTexture() {
    let image = new Image()
    image.src = 'assets/texture/logo.jpg'
    image.onload = function () {
      let texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

      gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

      App.instance.texture = texture
    }
  }

  update() {
    this.rot += 1

    let model = Matrix4.Rotation(Quaternion.Euler(0, 0, this.rot))
    let view = Matrix4.LookTo(
      new Vector3(0, 0, -10),
      new Vector3(0, 0, 1),
      new Vector3(0, 1, 0))
    let proj = Matrix4.Perspective(45, canvas.width / canvas.height, 0.3, 1000)

    this.mvp = proj.multiply(view).multiply(model)
  }

  render() {
    if (this.texture == null) {
      return
    }

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
    gl.useProgram(this.program)

    let loc = gl.getUniformLocation(this.program, 'uMVP')
    gl.uniformMatrix4fv(loc, false, this.mvp.data)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    loc = gl.getUniformLocation(this.program, 'uTexture')
    gl.uniform1i(loc, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)

    loc = gl.getAttribLocation(this.program, 'aPosition')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 4 * 5, 0)

    loc = gl.getAttribLocation(this.program, 'aUV')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 4 * 5, 4 * 3)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo)
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
  }

  onTouchStart(x, y) {

  }

  onTouchMove(x, y) {

  }

  onTouchEnd(x, y) {

  }
}
