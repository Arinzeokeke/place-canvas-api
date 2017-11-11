const mongoose = require('mongoose')
const User = mongoose.model('users')
module.exports = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id })
  req.user = user
  next()
}
