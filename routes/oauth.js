const passport = require('passport')
const express = require('express')
const router = express.Router()

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    session: false
  })
)
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) =>
    res.render('authenticated.html', {
      user: JSON.stringify(req.user.generateAuthBody())
    })
)

router.get(
  '/twitter',
  passport.authenticate('twitter', {
    session: false
  })
)

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { session: false }),
  (req, res) =>
    res.render('authenticated.html', {
      user: JSON.stringify(req.user.generateAuthBody())
    })
)

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login'],
    session: false
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) =>
    res.render('authenticated.html', {
      user: JSON.stringify(req.user.generateAuthBody())
    })
)

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
)

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) =>
    res.render('authenticated.html', {
      user: JSON.stringify(req.user.generateAuthBody())
    })
)

module.exports = router
