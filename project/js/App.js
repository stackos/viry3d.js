import Application from './wegame/Application'
import Vector2 from './wegame/math/Vector2'
import Vector3 from './wegame/math/Vector3'
import Quaternion from './wegame/math/Quaternion'
import Material from './wegame/graphics/Material'
import Mesh from './wegame/graphics/Mesh'
import MeshRenderer from './wegame/graphics/MeshRenderer'
import Camera from './wegame/graphics/Camera'

export default class App extends Application {
  constructor() {
    super()
  }

  init() {
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

    let renderer = new MeshRenderer()
    renderer.setMaterial(Material.Create('UnlitTexture'))
    renderer.setMesh(mesh)
    this.renderer = renderer

    let camera = new Camera(canvas.width, canvas.height)
    camera.setLocalPosition(new Vector3(0, 0, -10))
    camera.setClearColor(0, 0, 0, 1)
    camera.setFov(45)
    camera.setNear(0.3)
    camera.setFar(1000)
    this.camera = camera

    this.loadTexture()

    this.rot = 0
  }

  loadTexture(path) {
    let image = new Image()
    image.src = 'assets/texture/logo.jpg'
    image.onload = () => {
      let texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

      gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

      this.renderer.getMaterial().setTexture2D('uTexture', texture)
      this.texture = texture
    }
  }

  update() {
    this.rot += 1
    this.renderer.setLocalRotation(Quaternion.Euler(0, this.rot, 0))
  }

  render() {
    if (this.texture == null) {
      return
    }

    this.camera.clearTarget()
    this.renderer.render(this.camera)
  }

  onTouchStart(x, y) {

  }

  onTouchMove(x, y) {

  }

  onTouchEnd(x, y) {

  }
}
