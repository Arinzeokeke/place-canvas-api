const express = require('express')
const router = express.Router()
const passport = require('passport')
const validations = require('../../middlewares/validations')

router.post('/users', validations, async (req, res) => {
  let user = new User({
    username: req.body.user.username
  })
  user.setPassword(req.body.user.password)

  const newUser = await user.save()

  return res.send({ user: user.generateAuthBody() })
})

router.post('/users/login', validations, (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (user) {
      return res.send({ user: user.generateAuthBody() })
    } else {
      return res.status(422).json(info)
    }
  })(req, res, next)
})

module.exports = router
