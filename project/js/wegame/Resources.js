import Texture2D from './graphics/Texture2D'

export default class Resources {
  static LoadImage(path) {
    return new Promise((resolve, reject) => {
      let image = new Image()
      image.src = path
      image.onload = () => {
        resolve(image)
      }
      image.onerror = () => {
        reject('failed to load image: ' + path)
      }
    })
  }

  static LoadTexture2D(path) {
    return new Promise((resolve, reject) => {
      Resources.LoadImage(path)
        .then(image => {
          let texture = new Texture2D(image.width, image.height)
          texture.setImage(image)
          resolve(texture)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
