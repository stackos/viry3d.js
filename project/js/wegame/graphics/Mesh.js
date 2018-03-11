const POSITION_SIZE = 4 * 3
const UV_SIZE = 4 * 2
const COLOR_SIZE = 4 * 4
const NORMAL_SIZE = 4 * 3
const TANGENT_SIZE = 4 * 4
const BONE_INDICES_SIZE = 2 * 4
const BONE_WEIGHTS_SIZE = 4 * 4
const VERTEX_SIZE = POSITION_SIZE + UV_SIZE + UV_SIZE + COLOR_SIZE + NORMAL_SIZE + TANGENT_SIZE + BONE_INDICES_SIZE + BONE_WEIGHTS_SIZE

export default class Mesh {
  constructor(vertexCount) {
    this.buffer = new DataView(new ArrayBuffer(VERTEX_SIZE * vertexCount))
    this.indices = new Array()
  }

  setVertex(index, pos) {
    let offset = 0
    this.buffer.setFloat32(VERTEX_SIZE * index + offset, pos.x)
    this.buffer.setFloat32(VERTEX_SIZE * index + offset + 4, pos.y)
    this.buffer.setFloat32(VERTEX_SIZE * index + offset + 8, pos.z)
  }

  setUV(index, uv) {
    let offset = POSITION_SIZE
    this.buffer.setFloat32(VERTEX_SIZE * index + offset, uv.x)
    this.buffer.setFloat32(VERTEX_SIZE * index + offset + 4, uv.y)
  }

  clearIndices() {
    this.indices = new Array()
  }

  addIndices(indices) {
    this.indices.push(new Int16Array(indices))
  }
}
