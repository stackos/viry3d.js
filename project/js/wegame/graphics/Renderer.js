export default class Renderer {
  constructor() {
    this.materials = new Array()
  }

  clearMaterials() {
    while (this.materials.length > 0) {
      this.materials.pop()
    }
  }

  setMaterial(mat) {
    this.clearMaterials()
    this.materials.push(mat)
  }

  setMaterials(mats) {
    this.clearMaterials()
    for (let mat of mats) {
      this.materials.push(mat)
    }
  }

  render() {
    let vb = this.getVertexBuffer()
    let attribs = this.getVertexAttribs()
    let ib = this.getIndexBuffer()

    if (vb == null || attribs == null || ib == null) {
      return
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vb)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib)

    for (let i = 0; i < this.materials.length; ++i) {
      let material = this.materials[i]
      let shader = material.getShader()
      let range = this.getIndexRange(i)

      for (let j = 0; j < shader.getPassCount(); ++j) {
        let program = shader.getProgram(j)

        material.apply(j)

        for (let attrib of attribs) {
          let loc = gl.getAttribLocation(program, attrib.name)
          if (loc != null) {
            gl.enableVertexAttribArray(loc)
            gl.vertexAttribPointer(loc, attrib.count, attrib.type, false, attrib.stride, attrib.offset)
          }
        }

        gl.drawElements(range.type, range.count, range.indexType, range.offset)
      }
    }
  }
}
