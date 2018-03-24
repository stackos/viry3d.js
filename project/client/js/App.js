import Application from './wegame/Application'
import Vector3 from './wegame/math/Vector3'
import Camera from './wegame/graphics/Camera'
import Renderer from './wegame/graphics/Renderer'
import Quaternion from './wegame/math/Quaternion'
import Cubemap from './wegame/graphics/Cubemap'

export default class App extends Application {
  constructor() {
    super()
  }

  init() {
    let camera = new Camera(canvas.width, canvas.height)
    camera.setLocalPosition(new Vector3(0, 2, -7))
    camera.setLocalRotation(Quaternion.Euler(15, 0, 0))
    camera.setClearColor(0, 0, 0, 1)
    camera.setFov(45)
    camera.setNear(0.3)
    camera.setFar(1000)
    this.camera = camera

    let cubemapImages = [
      Resources.LoadImage('assets/texture/cubemap/diffuse/diffuse_right_0.jpg'),
      Resources.LoadImage('assets/texture/cubemap/diffuse/diffuse_left_0.jpg'),
      Resources.LoadImage('assets/texture/cubemap/diffuse/diffuse_top_0.jpg'),
      Resources.LoadImage('assets/texture/cubemap/diffuse/diffuse_bottom_0.jpg'),
      Resources.LoadImage('assets/texture/cubemap/diffuse/diffuse_front_0.jpg'),
      Resources.LoadImage('assets/texture/cubemap/diffuse/diffuse_back_0.jpg'),

      Resources.LoadImage('assets/texture/cubemap/specular/specular_right_1.jpg'),
      Resources.LoadImage('assets/texture/cubemap/specular/specular_left_1.jpg'),
      Resources.LoadImage('assets/texture/cubemap/specular/specular_top_1.jpg'),
      Resources.LoadImage('assets/texture/cubemap/specular/specular_bottom_1.jpg'),
      Resources.LoadImage('assets/texture/cubemap/specular/specular_front_1.jpg'),
      Resources.LoadImage('assets/texture/cubemap/specular/specular_back_1.jpg'),
    ]

    Promise.all(cubemapImages)
      .then(images => {
        this.diffuseCubemap = new Cubemap(images[0].width, images[0].height, gl.LINEAR, gl.REPEAT, false)
        for (let i = 0; i < 6; ++i) {
          this.diffuseCubemap.setImage(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, images[i], 0)
        }

        this.specularCubemap = new Cubemap(images[6].width, images[6].height, gl.LINEAR, gl.REPEAT, false)
        for (let i = 0; i < 6; ++i) {
          this.specularCubemap.setImage(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, images[6 + i], 0)
        }

        //return Resources.LoadGLTF('assets/gltf/BoomBox/glTF/BoomBox.gltf')
        return Resources.LoadGLTF('https://raw.githubusercontent.com/stackos/wegame.js/master/assets/gltf/BoomBox/glTF/BoomBox.gltf')
      })
      .then(node => {
        this.sceneNode = node
        this.sceneNode.setLocalScale(new Vector3(100, 100, 100))

        this.setEnvMap(this.sceneNode, 'u_DiffuseEnvSampler', this.diffuseCubemap)
        this.setEnvMap(this.sceneNode, 'u_SpecularEnvSampler', this.specularCubemap)
      })
      .catch(error => {
        console.error(error)
      })

    this.rot = 0
  }

  setEnvMap(node, name, cubemap) {
    if (node instanceof Renderer) {
      let mat = node.getMaterial()
      if (mat.getShader().getName() == 'PBR') {
        mat.setTexture(name, cubemap)
      }
    }

    let childCount = node.getChildCount()
    for (let i = 0; i < childCount; ++i) {
      this.setEnvMap(node.getChild(i), name, cubemap)
    }
  }

  update() {
    if (this.sceneNode != null) {
      this.rot += 1
      this.sceneNode.setLocalRotation(Quaternion.Euler(0, this.rot, 0))
    }
  }

  render() {
    if (this.sceneNode != null) {
      this.camera.clearTarget()
      this.drawNode(this.sceneNode)
    }
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
