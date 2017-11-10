const router = require('express').Router()
const auth = require('../../middlewares/auth')
const Pixel = mongoose.model('pixels')

router.post('/draw', auth, (req, res) => {})

module.exports = router
