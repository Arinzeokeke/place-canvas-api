const express = require('express')
const app = express()
const cors = require('cors'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler'),
  session = require('express-session')
const mongoose = require('mongoose')
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

mongoose.connect(
  'mongodb://reddit-canvas:dimitar9berbatov@ds249355.mlab.com:49355/reddit-canvas'
) //(keys.mongoUrl)
console.log(keys)

//models
require('./models/users')

//passport
require('./services/passport')

//routes
app.use(require('./routes'))

if (!isProduction) {
  mongoose.set('debug', true)

  app.use(errorhandler())
}

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listen on port ${process.env.PORT || 5000}`)
})
