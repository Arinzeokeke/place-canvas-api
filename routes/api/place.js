const router = require('express').Router()
const mongoose = require('mongoose')
const Pixel = mongoose.model('pixels')
const { pixelPlaceValidation } = require('../../middlewares/validations')
const auth = require('../../middlewares/auth')

const currentUser = require('../../middlewares/getCurrentUser')
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

router.post(
  '/draw',
  auth,
  currentUser,
  pixelPlaceValidation,
  async (req, res) => {
    const user = req.user
    if (user.canDrawPixel()) {
      const { x, y, color: { r, g, b } } = req.body
      let pixel = await Pixel.findOrCreate({ x, y })
      pixel = pixel.doc
      console.log(pixel)
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
  }
)

// temporary. for seeding canvas, dont expose this endpoint
router.post('/seed', auth, currentUser, async (req, res) => {
  for (var i = 0; i < 1000; i += 1) {
    for (var j = 0; j < 1000; j += 1) {
      let pixel = await Pixel.findOrCreate(
        { x: i, y: j },
        {
          rCol: parseInt(Math.random() * (255 - 0) + 0),
          gCol: parseInt(Math.random() * (255 - 0) + 0),
          bCol: parseInt(Math.random() * (255 - 0) + 0),
          _user: req.user.id
        }
      )
      // pixel.rCol = r
      // pixel.gCol = g
      // pixel.bCol = b
      // pixel._user = user.id
      // pixel.draws += 1
      // const savedPixel = await pixel.save()
    }
  }
  res.send({ message: 'lads' })
})

module.exports = router
