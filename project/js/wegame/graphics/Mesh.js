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
    this.littleEndian = (function () {
      let buffer = new ArrayBuffer(2)
      new DataView(buffer).setInt16(0, 256, true)
      return new Int16Array(buffer)[0] === 256;
    })();
  }

  getAttribOffset(attrib) {
    for (let i = 0; i < this.attribs.length; ++i) {
      if (this.attribs[i] == attrib) {
        return this.offsets[i]
      }
    }
    return -1
  }

  hasAttrib(attrib) {
    for (let i = 0; i < this.attribs.length; ++i) {
      if (this.attribs[i] == attrib) {
        return true
      }
    }
    return false
  }

  getVertexStride() {
    return this.vertexStride
  }

  setVertex(index, pos) {
    let offset = this.getAttribOffset(Mesh.VERTEX_POSITION)
    this.dataView.setFloat32(this.vertexStride * index + offset + 0, pos.x, this.littleEndian)
    this.dataView.setFloat32(this.vertexStride * index + offset + 4, pos.y, this.littleEndian)
    this.dataView.setFloat32(this.vertexStride * index + offset + 8, pos.z, this.littleEndian)
  }

  setUV(index, uv) {
    let offset = this.getAttribOffset(Mesh.VERTEX_UV)
    this.dataView.setFloat32(this.vertexStride * index + offset + 0, uv.x, this.littleEndian)
    this.dataView.setFloat32(this.vertexStride * index + offset + 4, uv.y, this.littleEndian)
  }

  clearIndices() {
    this.indices = new Array()
  }

  addIndices(indices) {
    this.indices.push(new Int16Array(indices))
  }

  getVertexBuffer() {
    if (this.vb == null) {
      this.vb = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vb)
      gl.bufferData(gl.ARRAY_BUFFER, this.dataView, gl.STATIC_DRAW)
    }
    return this.vb
  }

  getIndexBuffer() {
    if (this.ib == null) {
      let indexCount = 0
      for (let indices of this.indices) {
        indexCount += indices.length
      }
      let offset = 0
      let indexBuffer = new Int16Array(indexCount)
      for (let indices of this.indices) {
        for (let i = 0; i < indices.length; ++i) {
          indexBuffer[offset + i] = indices[i]
        }
        offset += indices.length
      }

      this.ib = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ib)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBuffer, gl.STATIC_DRAW)
    }
    return this.ib
  }

  getIndexRange(materialIndex) {
    if (this.ranges == null) {
      this.ranges = new Array()

      let offset = 0
      for (let indices of this.indices) {
        this.ranges.push({
          type: gl.TRIANGLES,
          count: indices.length,
          indexType: gl.UNSIGNED_SHORT,
          offset: offset,
        })
        offset += indices.length
      }
    }
    return this.ranges[materialIndex]
  }
}
