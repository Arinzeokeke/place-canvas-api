const passport = require('passport')
const express = require('express')
const router = express.Router()

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', {
    session: false
  })
)
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) =>
    res.render('authenticated.html', {
      user: JSON.stringify(req.user.generateAuthBody)
    })
)

module.exports = router
