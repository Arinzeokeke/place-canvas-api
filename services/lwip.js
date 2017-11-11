const lwip = require('pajk-lwip')
const mongoose = require('mongoose')
const Pixel = mongoose.model('pixels')
const { BOARD_SIZE } = require('../config/constants')

const generateEmptyImage = () => {
  return new Promise((resolve, reject) => {
    lwip.create(BOARD_SIZE, BOARD_SIZE, 'white', (err, image) => {
      if (err) {
        return reject(err)
      }
      resolve(image)
    })
  })
}

const drawImage = canvas => {
  return new Promise((resolve, reject) => {
    let batch = canvas.batch()
    Pixel.find({})
      .stream()
      .on('data', pixel => {
        const { x, y, rCol, gCol, bCol } = pixel
        batch.setPixel(x, y, [rCol, gCol, bCol])
      })
      .on('end', () => {
        batch.exec((err, image) => {
          if (err) {
            return reject(err)
          }
          image.toBuffer(
            'png',
            {
              transparency: false
            },
            (err, buffer) => {
              if (err) {
                return reject(err)
              }
              resolve(buffer)
            }
          )
        })
      })
      .on('error', err => {
        return reject(err)
      })
  })
}

module.exports = {
  drawImage,
  generateEmptyImage
}
