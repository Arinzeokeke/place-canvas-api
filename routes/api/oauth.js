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
      user: JSON.stringify(req.user.generateAuthBody())
    })
)

router.get(
  '/auth/twitter',
  passport.authenticate('twitter', {
    session: false
  })
)

router.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { session: false }),
  (req, res) =>
    res.render('authenticated.html', {
      user: JSON.stringify(req.user.generateAuthBody())
    })
)

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login'],
    session: false
  })
)

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) =>
    res.render('authenticated.html', {
      user: JSON.stringify(req.user.generateAuthBody())
    })
)

module.exports = router
