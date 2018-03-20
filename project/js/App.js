import Application from './wegame/Application'
import Vector3 from './wegame/math/Vector3'
import Camera from './wegame/graphics/Camera'
import Resources from './wegame/Resources'
import Renderer from './wegame/graphics/Renderer'
import Quaternion from './wegame/math/Quaternion'

export default class App extends Application {
  constructor() {
    super()
  }

  init() {
    let camera = new Camera(canvas.width, canvas.height)
    camera.setLocalPosition(new Vector3(0, 2, -5))
    camera.setLocalRotation(Quaternion.Euler(15, 0, 0))
    camera.setClearColor(0, 0, 0, 1)
    camera.setFov(45)
    camera.setNear(0.3)
    camera.setFar(1000)
    this.camera = camera

    //Resources.LoadGLTF('assets/gltf/min.gltf')
    Resources.LoadGLTF('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Embedded/Duck.gltf')
    //Resources.LoadGLTFBinary('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb')
      .then(node => {
        this.sceneNode = node
        this.sceneNode.setLocalScale(new Vector3(0.01, 0.01, 0.01))
      })
      .catch(error => {
        console.error(error)
      })

    this.rot = 0
  }

  update() {
    if (this.sceneNode == null) {
      return
    }

    this.rot += 1
    this.sceneNode.setLocalRotation(Quaternion.Euler(0, this.rot, 0))
  }

  render() {
    if (this.sceneNode == null) {
      return
    }

    this.camera.clearTarget()
    this.drawNode(this.sceneNode)
  }

  drawNode(node) {
    if (node instanceof Renderer) {
      node.render(this.camera)
    }

    let childCount = node.getChildCount()
    for (let i = 0; i < childCount; ++i) {
      this.drawNode(node.getChild(i))
    }
  }

  onTouchStart(x, y) {

  }

  onTouchMove(x, y) {

  }

  onTouchEnd(x, y) {

  }
}
