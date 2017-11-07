const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/keys')

const userSchema = new mongoose.Schema({
  googleId: String,
  facebookId: String,
  twitterId: String,
  githubId: String,
  avatar: String,
  draws: { type: Number, default: 0 },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: true
  }
})

userSchema.plugin(uniqueValidator, { message: 'is already taken.' })

userSchema.methods.generateJWT = () => {
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

userSchema.methods.generateAuthBody = () => {
  return {
    draws: this.draws,
    avatar: this.avatar,
    username: this.username,
    token: this.generateJWT
  }
}
mongoose.model('users', userSchema)
