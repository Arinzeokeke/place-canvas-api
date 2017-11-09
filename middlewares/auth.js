const jwt = require('express-jwt')
const secret = require('../config/keys').secret

const getTokenFromHeader = req => {
  const splitHeader = req.headers.authorization.split(' ')
  if (
    req.headers.authorization &&
    splitHeader.length === 2 &&
    splitHeader[0].toLowerCase() === 'bearer'
  ) {
    return splitHeader[1]
  }
  return null
}

module.exports = jwt({
  secret: secret,
  userProperty: 'user',
  getToken: getTokenFromHeader
})
