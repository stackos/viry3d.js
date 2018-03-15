export default class Application {
  constructor() {
    window.gl = canvas.getContext('webgl',
      {
        antialias: false,
        preserveDrawingBuffer: false,
        antialiasSamples: 2,
      })

    this.init()
    this.startAnimation()
  }

  startAnimation() {
    this.bindLoop = this.loop.bind(this)

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )

    canvas.addEventListener('touchstart', e => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      this.onTouchStart(x, y)
    })

    canvas.addEventListener('touchmove', e => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      this.onTouchMove(x, y)
    })

    let touchEnd = e => {
      e.preventDefault()

      let x = e.changedTouches[0].clientX
      let y = e.changedTouches[0].clientY

      this.onTouchEnd(x, y)
    }
    canvas.addEventListener('touchend', touchEnd)
    canvas.addEventListener('touchcancel', touchEnd)
  }

  // 实现游戏帧循环
  loop() {
    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  init() {
    
  }

  update() {

  }

  render() {

  }

  onTouchStart(x, y) {

  }

  onTouchMove(x, y) {

  }

  onTouchEnd(x, y) {

  }
}
