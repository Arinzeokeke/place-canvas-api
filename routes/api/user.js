const router = require('express').Router()
const mongoose = require('mongoose')
const auth = require('../../middlewares/auth')
const User = mongoose.model('users')

router.get('/', auth, (req, res) => {
  res.send(req.user.generateAuthBody())
})

router.put('/', auth, (req, res) => {
  const { avatar, username } = req.body.user

  if (avatar && username) {
    const user = await User.updateOne(
      {
        _id: req.user.id
      },
      {
        avatar,
        username
      }
    ).exec()
    res.send(user.generateAuthBody())

  }
})
