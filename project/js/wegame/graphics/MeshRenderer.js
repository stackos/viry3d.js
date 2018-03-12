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

  getVertexBuffer() {
    if (this.mesh != null) {
      return this.mesh.getVertexBuffer()
    }
    return null
  }

  getVertexAttribs() {
    if (this.mesh != null) {
      if (this.attribs == null) {
        let attribs = new Array()

        if (this.mesh.hasAttrib(Mesh.VERTEX_POSITION)) {
          attribs.push({
            name: 'aPosition',
            count: 3,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_POSITION)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_UV)) {
          attribs.push({
            name: 'aUV',
            count: 2,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_UV)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_UV2)) {
          attribs.push({
            name: 'aUV2',
            count: 2,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_UV2)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_COLOR)) {
          attribs.push({
            name: 'aColor',
            count: 4,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_COLOR)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_NORMAL)) {
          attribs.push({
            name: 'aNormal',
            count: 3,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_NORMAL)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_TANGENT)) {
          attribs.push({
            name: 'aTangent',
            count: 4,
            type: gl.FLOAT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_TANGENT)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_BONE_INDICES)) {
          attribs.push({
            name: 'aBoneIndices',
            count: 4,
            type: gl.SHORT,
            stride: this.mesh.getVertexStride(),
            offset: this.mesh.getAttribOffset(Mesh.VERTEX_BONE_INDICES)
          })
        }
        if (this.mesh.hasAttrib(Mesh.VERTEX_BONE_WEIGHTS)) {
          attribs.push({
            name: 'aBoneWeights',
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

  getIndexBuffer() {
    if (this.mesh != null) {
      return this.mesh.getIndexBuffer()
    }
    return null
  }

  getIndexRange(materialIndex) {
    if (this.mesh != null) {
      return this.mesh.getIndexRange(materialIndex)
    }
    return null
  }
}
