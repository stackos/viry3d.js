import Application from './wegame/Application'
import Vector2 from './wegame/math/Vector2'
import Vector3 from './wegame/math/Vector3'
import Quaternion from './wegame/math/Quaternion'
import Matrix4 from './wegame/math/Matrix4'
import Material from './wegame/graphics/Material'
import Mesh from './wegame/graphics/Mesh'
import MeshRenderer from './wegame/graphics/MeshRenderer'

export default class App extends Application {
  static instance = null

  constructor() {
    super()

    App.instance = this
  }

  init() {
    this.material = Material.Create('UnlitTexture')

    let mesh = new Mesh(8, [Mesh.VERTEX_POSITION, Mesh.VERTEX_UV])
    mesh.setVertex(0, new Vector3(-1, 1, -1))
    mesh.setVertex(1, new Vector3(-1, -1, -1))
    mesh.setVertex(2, new Vector3(1, -1, -1))
    mesh.setVertex(3, new Vector3(1, 1, -1))
    mesh.setVertex(4, new Vector3(-1, 1, 1))
    mesh.setVertex(5, new Vector3(-1, -1, 1))
    mesh.setVertex(6, new Vector3(1, -1, 1))
    mesh.setVertex(7, new Vector3(1, 1, 1))
    mesh.setUV(0, new Vector2(0, 0))
    mesh.setUV(1, new Vector2(0, 1))
    mesh.setUV(2, new Vector2(1, 1))
    mesh.setUV(3, new Vector2(1, 0))
    mesh.setUV(4, new Vector2(1, 0))
    mesh.setUV(5, new Vector2(1, 1))
    mesh.setUV(6, new Vector2(0, 1))
    mesh.setUV(7, new Vector2(0, 0))
    mesh.addIndices([
      0, 1, 2, 0, 2, 3,
      3, 2, 6, 3, 6, 7,
      7, 6, 5, 7, 5, 4,
      4, 5, 1, 4, 1, 0,
      4, 0, 3, 4, 3, 7,
      1, 5, 6, 1, 6, 2,
    ])

    this.renderer = new MeshRenderer()
    this.renderer.setMaterial(this.material)
    this.renderer.setMesh(mesh)

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 1)

    this.createTexture()

    this.rot = 0
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

    let model = Matrix4.Rotation(Quaternion.Euler(0, this.rot, 0))
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
    this.material.setTexture2D('uTexture', this.texture)

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

    this.renderer.render()
  }

  onTouchStart(x, y) {

  }

  onTouchMove(x, y) {

  }

  onTouchEnd(x, y) {

  }
}
