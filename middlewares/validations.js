const { BOARD_SIZE } = require('../config/constants')

const authValidation = (req, res, next) => {
  if (!req.body.user) {
    res.status(422).send({ errors: 'No user json found in body!' })
  } else if (!req.body.user.username || req.body.user.username == '') {
    res.status(422).send({ errors: { username: "can't be blank" } })
  } else if (!req.body.user.password || req.body.user.password == '') {
    res.status(422).send({ errors: { password: "can't be blank" } })
  }

  next()
}

const pixelPlaceValidation = (req, res, next) => {
  if (req.body.color == undefined) {
    res.status(422).send({ errors: { color: "can't be blank!" } })
  }
  const { x, y, color: { r, g, b } } = req.body
  if (
    x == undefined ||
    y == undefined ||
    r == undefined ||
    g == undefined ||
    b == undefined
  ) {
    res.status(422).send({
      errors: {
        params: 'x, y and color(object with r, g, b keys) must all be defined'
      }
    })
  }
  if (!(validateNumber(255, r, g, b) && validateNumber(BOARD_SIZE, x, y))) {
    res.status.send({
      errors: { args: 'x, y, and color must all be integers' }
    })
  }
  next()
}

const validateNumber = (limit, ...args) => {
  args.forEach(each => {
    if (+each === NaN || +each < 0 || +each > limit) {
      return false
    }
  })

  return true
}

module.exports = {
  pixelPlaceValidation,
  authValidation
}
