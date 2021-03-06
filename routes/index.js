const express = require('express'),
  router = express.Router()
router.use('/auth', require('./oauth'))
router.use('/api/user', require('./api/user'))
router.use('/api/users', require('./api/users'))
router.use('/api/place', require('./api/place'))

router.use(function(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message

        return errors
      }, {})
    })
  }

  return next(err)
})

module.exports = router
