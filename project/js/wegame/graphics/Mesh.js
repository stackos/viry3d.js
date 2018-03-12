
export default class Mesh {
  static VERTEX_POSITION =      0
  static VERTEX_UV =            1
  static VERTEX_UV2 =           2
  static VERTEX_COLOR =         3
  static VERTEX_NORMAL =        4
  static VERTEX_TANGENT =       5
  static VERTEX_BONE_INDICES =  6
  static VERTEX_BONE_WEIGHTS =  7
  static VERTEX_ATTRIB_COUNT =  8
  static VERTEX_ATTRIB_SIZES = [ 4 * 3, 4 * 2, 4 * 2, 4 * 4, 4 * 3, 4 * 4, 2 * 4, 4 * 4 ]

  constructor(vertexCount, attribs) {
    let offset = 0
    let offsets = []
    let vertexStride = 0

    for (let i of attribs) {
      let size = Mesh.VERTEX_ATTRIB_SIZES[i]
      offsets.push(offset)
      offset += size
      vertexStride += size
    }

    this.attribs = attribs
    this.offsets = offsets
    this.vertexStride = vertexStride
    this.dataView = new DataView(new ArrayBuffer(this.vertexStride * vertexCount))
    this.indices = new Array()
  }

  getAttribOffset(attrib) {
    for (let i = 0; i < this.attribs.length; ++i) {
      if (this.attribs[i] == attrib) {
        return this.offsets[i]
      }
    }

    return -1
  }

  setVertex(index, pos) {
    let offset = this.getAttribOffset(Mesh.VERTEX_POSITION)
    this.dataView.setFloat32(this.vertexStride * index + offset + 0, pos.x)
    this.dataView.setFloat32(this.vertexStride * index + offset + 4, pos.y)
    this.dataView.setFloat32(this.vertexStride * index + offset + 8, pos.z)
  }

  setUV(index, uv) {
    let offset = this.getAttribOffset(Mesh.VERTEX_UV)
    this.dataView.setFloat32(this.vertexStride * index + offset + 0, uv.x)
    this.dataView.setFloat32(this.vertexStride * index + offset + 4, uv.y)
  }

  clearIndices() {
    this.indices = new Array()
  }

  addIndices(indices) {
    this.indices.push(new Int16Array(indices))
  }
}
