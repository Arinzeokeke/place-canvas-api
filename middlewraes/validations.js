module.exports = (req, res, next) => {
  if (!req.body.user) {
    res.status(422).send({ errors: 'No user json found in body!' })
  } else if (!req.body.user.username || req.body.user.username == '') {
    res.status(422).send({ errors: { username: "can't be blank" } })
  } else if (!req.body.user.password || req.body.user.password == '') {
    res.status(422).send({ errors: { password: "can't be blank" } })
  }

  next()
}
