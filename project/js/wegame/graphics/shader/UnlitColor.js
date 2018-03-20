import Const from './Const'

const vs = `
  uniform mat4 uMVP;
  attribute vec4 aPosition;
  void main()
  {
    gl_Position = aPosition * uMVP;
  }
`

const fs = `
  precision mediump float;
  uniform vec4 uColor;
  void main()
  {
    gl_FragColor = uColor;
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
