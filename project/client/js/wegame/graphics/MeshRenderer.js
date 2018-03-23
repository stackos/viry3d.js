import Renderer from './Renderer'
import Mesh from './Mesh'

export default class MeshRenderer extends Renderer {
  constructor() {
    super()
  }

  setMesh(mesh) {
    this.mesh = mesh
    this.attribs = null
  }

  getVertexBuffer() { // override
    if (this.mesh != null) {
      return this.mesh.getVertexBuffer()
    }
    return null
  }

  getVertexAttribs() { // override
    if (this.mesh != null) {
      if (this.attribs == null) {
        let attribs = new Array()

        if (this.mesh.hasAttrib(Mesh.VERTEX_POSITION)) {
          attribs.push({
            name: 'a_Position',
            count: 3,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_POSITION)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_UV)) {
          attribs.push({
            name: 'a_UV',
            count: 2,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_UV)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_UV2)) {
          attribs.push({
            name: 'a_UV2',
            count: 2,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_UV2)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_COLOR)) {
          attribs.push({
            name: 'a_Color',
            count: 4,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_COLOR)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_NORMAL)) {
          attribs.push({
            name: 'a_Normal',
            count: 3,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_NORMAL)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_TANGENT)) {
          attribs.push({
            name: 'a_Tangent',
            count: 4,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_TANGENT)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_BONE_INDICES)) {
          attribs.push({
            name: 'a_BoneIndices',
            count: 4,
            type: gl.SHORT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_BONE_INDICES)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_BONE_WEIGHTS)) {
          attribs.push({
            name: 'a_BoneWeights',
            count: 4,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_BONE_WEIGHTS)
          })
        }

        this.attribs = attribs
      }
      return this.attribs
    }
    return null
  }

  getIndexBuffer() { // override
    if (this.mesh != null) {
      return this.mesh.getIndexBuffer()
    }
    return null
  }

  getIndexRange(materialIndex) { // override
    if (this.mesh != null) {
      return this.mesh.getIndexRange(materialIndex)
    }
    return null
  }
}
