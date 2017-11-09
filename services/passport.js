const passport = require('passport'),
  FacebookTokenStrategy = require('passport-facebook-token')
const keys = require('../config/keys')
const User = mongoose.model('users')

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: keys.facebookClientId,
      clientSecret: keys.facebookSecretKey
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
