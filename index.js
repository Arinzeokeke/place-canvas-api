const express = require('express')
const app = express()
const mongoose = require('mongoose')
const keys = require('./config/keys')

const isProduction = process.env.NODE_ENV === 'production'

mongoose.connect(keys.mongoUrl)

if (isProduction) {
  mongoose.set('debug', true)
}

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listen on port ${process.env.PORT || 3000}`)
})
