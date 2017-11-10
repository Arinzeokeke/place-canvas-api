const router = require('express').Router()
const auth = require('../../middlewares/auth')
const Pixel = mongoose.model('pixels')

router.get('/', (req, res) => {
  const pixels = Pixel.find({})
  res.send(pixels)
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

router.post('/draw', auth, async (req, res) => {
  const user = req.user
  if (user.canDrawPixel()) {
    const { x, y, color } = req.body
    let pixel = await Pixel.findOrCreate({ x, y })
    pixel.color = color
    pixel._user = user.id
    pixel.draws += 1
    const savedPixel = await pixel.save()
    user.draws += 1
    user.lastDraw = new Date()
    await user.save()
    //TODO socket io emission
    res.send(pixel)
  }
  res.status(422).send({
    errors: {
      user: "can't place pixel now"
    }
  })
})

module.exports = router
