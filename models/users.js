const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { secret } = require('../config/keys')

const userSchema = new mongoose.Schema(
  {
    googleId: String,
    facebookId: String,
    twitterId: String,
    githubId: String,
    avatar: String,
    draws: { type: Number, default: 0 },
    username: {
      type: String,
      unique: true,
      index: true
    },
    hash: String,
    salt: String,
    lastDraw: Date
  },
  {
    timestamps: true
  }
)

userSchema.plugin(uniqueValidator, { message: 'is already taken.' })

userSchema.methods.generateJWT = function() {
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 30)

  return jwt.sign(
    {
      id: this._id,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  )
}

userSchema.methods.generateAuthBody = function() {
  return {
    draws: this.draws,
    avatar: this.avatar,
    username: this.username,
    token: this.generateJWT()
  }
}

userSchema.methods.validatePassword = password => {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 2000, 512, 'sha512')
    .toString('hex')

  return this.hash === hash
}

userSchema.methods.canDrawPixel = function() {
  const now = new Date()
  if (!this.lastDraw || (now - this.lastDraw) / 1000 >= 60) {
    //you can draw!
    return true
  }
  //you can't draw :(
  return false
}

userSchema.methods.setPassword = password => {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 2000, 512, 'sha512')
    .toString('hex')
}
mongoose.model('users', userSchema)
