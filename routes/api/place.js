const router = require('express').Router()
const mongoose = require('mongoose')
const Pixel = mongoose.model('pixels')
const { pixelPlaceValidation } = require('../../middlewares/validations')
const auth = require('../../middlewares/auth')
const { generateEmptyImage, drawImage } = require('../../services/lwip')

router.get('/', async (req, res) => {
  const canvas = await generateEmptyImage()
  const image = await drawImage(canvas)

  //TODO add info about last image update
  res.set({ 'Content-Type': 'image/png' }).send(image)
})

router.get('/pixel', async (req, res) => {
  const { x, y } = req.query
  if (x && y) {
    const pixel = await Pixel.findOne({ x, y })
    if (pixel) {
      res.send(pixel)
    }
    res.status(404).send({ errors: { pixel: 'Not Found' } })
  }
  res
    .status(422)
    .send({ errors: { coord: 'X and Y should both be in the query' } })
})

router.post('/draw', auth, pixelPlaceValidation, async (req, res) => {
  const user = req.user
  if (user.canDrawPixel()) {
    const { x, y, color: { r, g, b } } = req.body
    let pixel = await Pixel.findOrCreate({ x, y })
    pixel.rCol = r
    pixel.gCol = g
    pixel.bCol = b
    pixel._user = user.id
    pixel.draws += 1
    const savedPixel = await pixel.save()
    user.draws += 1
    user.lastDraw = new Date()
    await user.save()
    // socket io emission
    if (req.io) {
      req.io.emit('draw', pixel)
    }
    res.send(pixel)
  }
  res.status(422).send({
    errors: {
      user: "can't place pixel now"
    }
  })
})

module.exports = router
