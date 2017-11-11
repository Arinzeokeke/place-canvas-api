const lwip = require('pajk-lwip')
const mongoose = require('mongoose')
const Pixel = mongoose.model('pixels')
const { BOARD_SIZE } = require('../config/constants')

const generateEmptyImage = () => {
  lwip.create(BOARD_SIZE, BOARD_SIZE, 'white', (err, image) => {
    if (err) {
      throw err
    }
    return image
  })
}

const drawImage = canvas => {
  let batch = canvas.batch()
  Pixel.find({})
    .stream()
    .on('data', pixel => {
      const { x, y, color: { rCol, gCol, bCol } } = pixel
      batch.setPixel(x, y, [rCol, gCol, bCol])
    })
    .on('end', () => {
      batch.exec((err, canvas) => {
        return canvas
      })
    })
    .on('error', err => {
      throw err
    })
}

module.exports = {
  drawImage,
  generateEmptyImage
}
