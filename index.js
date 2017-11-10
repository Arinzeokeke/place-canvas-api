const express = require('express')
const app = express()
const cors = require('cors'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler'),
  session = require('express-session'),
  mustacheExpress = require('mustache-express')
const mongoose = require('mongoose')
const passport = require('passport')
const keys = require('./config/keys')

const isProduction = process.env.NODE_ENV === 'production'

app.use(cors())

app.use(require('morgan')('dev'))
app.use(bodyParser.json())
app.use(require('method-override')())

app.use(express.static(__dirname + '/public'))

app.use(
  session({
    secret: 'place',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.engine('html', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/public')

mongoose.connect(keys.mongoUrl)

//models
require('./models/users')
require('./models/pixels')

//passport
require('./services/passport')

//routes
app.use(require('./routes'))

if (!isProduction) {
  mongoose.set('debug', true)

  app.use(errorhandler())
}

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server listen on port ${process.env.PORT || 8000}`)
})
