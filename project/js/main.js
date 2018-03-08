export default class Main {
  constructor() {
    this.init()

    // 维护当前requestAnimationFrame的id
    this.aniId = 0
    this.restart()
  }

  restart() {
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId)

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
  }

  // 实现游戏帧循环
  loop() {
    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  init() {
    window.gl = canvas.getContext('webgl',
      {
        antialias: false,
        preserveDrawingBuffer: false,
        antialiasSamples: 2,
      })

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 1)

    this.createProgram()
    this.createBuffer()
  }

  createProgram() {
    let vss = "\
    attribute vec4 aPos;\
    void main()\
    {\
      gl_Position = aPos;\
    }\
    "

    let fss = "\
    void main()\
    {\
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\
    }\
    "

    let vs = this.createShader(vss, gl.VERTEX_SHADER)
    let fs = this.createShader(fss, gl.FRAGMENT_SHADER)

    let program = gl.createProgram()

    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      let info = gl.getProgramInfoLog(program)
      throw 'Could not link WebGL program. \n\n' + info
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
      throw 'Could not compile WebGL shader. \n\n' + info
    }
    return shader
  }

  createBuffer() {
    let vertices = new Float32Array([0, 0, 0, 0.5, 0, 0, 0, 0.5, 0])
    let indices = new Int16Array([0, 1, 2])

    let vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    this.vbo = vbo

    let ibo = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
    this.ibo = ibo
  }

  update() {

  }

  render() {
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
    gl.useProgram(this.program)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
    let loc = gl.getAttribLocation(this.program, "aPos")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 4 * 3, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo)
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0)
  }
}
