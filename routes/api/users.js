const express = require('express')
const router = express.Router()
const validations = require('../../middlewares/validations')

router.post('/users', validations, async (req, res) => {
  let user = new User({
    username: req.body.user.username
  })
  user.setPassword(req.body.user.password)

  const newUser = await user.save()

  return res.json({ user: user.generateAuthBody() })
})
