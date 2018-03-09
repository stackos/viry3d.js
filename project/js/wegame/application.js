export default class Application {
  constructor() {
    this.init()
    this.startAnimation()
  }

  startAnimation() {
    this.bindLoop = this.loop.bind(this)

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )

    this.touchStartHandler = this.onTouchStartEvent.bind(this)
    canvas.addEventListener('touchstart', this.touchStartHandler)

    this.touchMoveHandler = this.onTouchMoveEvent.bind(this)
    canvas.addEventListener('touchmove', this.touchMoveHandler)

    this.touchEndHandler = this.onTouchEndEvent.bind(this)
    canvas.addEventListener('touchend', this.touchEndHandler)
    canvas.addEventListener('touchcancel', this.touchEndHandler)
  }

  onTouchStartEvent(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    this.onTouchStart(x, y)
  }

  onTouchMoveEvent(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    this.onTouchMove(x, y)
  }

  onTouchEndEvent(e) {
    e.preventDefault()

    let x = e.changedTouches[0].clientX
    let y = e.changedTouches[0].clientY

    this.onTouchEnd(x, y)
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
    window.gl = canvas.getContext('webgl',
      {
        antialias: false,
        preserveDrawingBuffer: false,
        antialiasSamples: 2,
      })
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
