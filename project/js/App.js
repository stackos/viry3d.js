import Application from './wegame/Application'
import Vector3 from './wegame/math/Vector3'
import Quaternion from './wegame/math/Quaternion'
import Matrix4 from './wegame/math/Matrix4'
import Material from './wegame/graphics/Material'
import Mesh from './wegame/graphics/Mesh'

export default class App extends Application {
  static instance = null

  constructor() {
    super()

    App.instance = this
  }

  init() {
    this.material = Material.Create('UnlitTexture')
    this.mesh = new Mesh(4)

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 1)

    this.createBuffer()
    this.createTexture()

    this.rot = 0
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
    let mvp = proj.multiply(view).multiply(model)

    this.material.setMatrix('uMVP', mvp.data)
  }

  render() {
    if (this.texture == null) {
      return
    }

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

    this.material.setTexture2D('uTexture', this.texture)
    this.material.apply(0)

    let program = this.material.getShader().getProgram(0)
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)

    let loc = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 4 * 5, 0)

    loc = gl.getAttribLocation(program, 'aUV')
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
