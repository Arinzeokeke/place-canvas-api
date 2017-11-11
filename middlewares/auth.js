const jwt = require('express-jwt')
const secret = require('../config/keys').secret

const getTokenFromHeader = req => {
  if (req.headers.authorization === undefined && req.headers.Authorization) {
    req.headers.authorization = req.headers.Authorization
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ').length === 2 &&
    req.headers.authorization.split(' ')[0].toLowerCase() === 'bearer'
  ) {
    console.log(req.headers.authorization.split(' ')[1])
    return req.headers.authorization.split(' ')[1]
  }
  return null
}

module.exports = jwt({
  secret: secret,
  userProperty: 'user',
  getToken: getTokenFromHeader
})
