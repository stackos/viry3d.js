import Const from './Const'

const vs = `
  uniform mat4 u_MVPMatrix;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  void main()
  {
    gl_Position = u_MVPMatrix * a_Position;
    v_UV = a_UV;
  }
`

const fs = `
  precision mediump float;
  uniform sampler2D u_BaseColorSampler;
  varying vec2 v_UV;
  void main()
  {
    gl_FragColor = texture2D(u_BaseColorSampler, v_UV);
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
