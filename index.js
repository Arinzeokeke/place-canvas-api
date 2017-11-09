const express = require('express')
const app = express()
const cors = require('cors'),
  bodyParser = require('body-parser'),
  errorhandler = require('errorhandler')
const mongoose = require('mongoose')
const keys = require('./config/keys')

const isProduction = process.env.NODE_ENV === 'production'

app.use(cors())

app.use(require('morgan')('dev'))
app.use(bodyParser.json())
app.use(require('method-override')())

app.use(express.static(__dirname + '/public'))

mongoose.connect(keys.mongoUrl)

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
