import Const from './Const'

const vs = `
  uniform mat4 uMVP;
  attribute vec4 aPosition;
  attribute vec2 aUV;
  varying vec2 vUV;
  void main()
  {
    gl_Position = aPosition * uMVP;
    vUV = aUV;
  }
`

const fs = `
  precision mediump float;
  uniform sampler2D uTexture;
  varying vec2 vUV;
  void main()
  {
    gl_FragColor = texture2D(uTexture, vUV);
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
