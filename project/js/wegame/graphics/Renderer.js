import Node from '../Node'

export default class Renderer extends Node {
  constructor() {
    super()

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

  getMaterial() {
    if (this.materials.length > 0) {
      return this.materials[0]
    }
    return null
  }

  getVertexBuffer() { // need override
    return null
  }

  getVertexAttribs() { // need override
    return null
  }

  getIndexBuffer() { // need override
    return null
  }

  getIndexRange(materialIndex) { // need override
    return null
  }

  render(camera) {
    let model = this.getLocalToWorldMatrix()
    let view = camera.getViewMatrix()
    let proj = camera.getProjectionMatrix()
    let mvp = proj.multiply(view).multiply(model)

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

      material.setMatrix('uMVP', mvp.data())

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
