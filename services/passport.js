const passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy
const keys = require('../config/keys')
const User = mongoose.model('users')

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebookClientId,
      clientSecret: keys.facebookSecretKey,
      callbackURL: '/auth/facebook/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({
        $or: [
          {
            facebookId: profile.id
          },
          { email: profile.email }
        ]
      })

      if (user) {
        //already exists, update fbId if not there
        user.facebookId = profile.id
        user.email = profile.email
        const updatedUser = await user.save()
        done(null, updatedUser)
      } else {
        const newUser = new User({
          facebookId: profile.id
        })
      }
    }
  )
)
