const passport = require('passport')
const express = require('express')
const router = express.Router()

router.get(
  '/auth/facebook/token',
  passport.authenticate('facebook-token'),
  (req, res) => res.send(req.user.generateAuthBody())
)

module.exports = router
