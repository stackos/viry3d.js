import Const from './Const'

const vs = `
  uniform mat4 u_MVPMatrix;
  attribute vec4 a_Position;
  void main()
  {
    gl_Position = u_MVPMatrix * a_Position;
  }
`

const fs = `
  precision mediump float;
  uniform vec4 u_BaseColorFactor;
  void main()
  {
    gl_FragColor = u_BaseColorFactor;
  }
`

const rs = {
    Cull: Const.Back,
    ZTest: Const.LEqual,
    ZWrite: Const.On,
    Blend: Const.Off,
    SrcBlendMode: Const.SrcAlpha,
    DstBlendMode: Const.OneMinusSrcAlpha,
    Queue: Const.Geometry,
}

export default [
  {
    vs: vs,
    fs: fs,
    rs: rs,
  }
]
