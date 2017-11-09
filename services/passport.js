const passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  LocalStrategy = require('passport-local').Strategy
const keys = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model('users')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[username]',
      passwordField: 'user[password]'
    },
    async (username, password, done) => {
      const user = await User.findOne({ username })
      if (!user || !user.validatePassword(password)) {
        return done(null, false, {
          errors: {
            'email or password': 'is invalid'
          }
        })
      }
      return done(null, user)
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebookClientId,
      clientSecret: keys.facebookSecretKey,
      callbackUrl: '/auth/facebook/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({
        facebookId: profile.id
      })

      if (user) {
        return done(null, user)
      } else {
        const avatar = profile.photos.length ? profile.photos[0].value : ''
        const newUser = await new User({
          facebookId: profile.id,
          avatar,
          username: profile.displayName
        }).save()
        return done(null, newUser)
      }
    }
  )
)
