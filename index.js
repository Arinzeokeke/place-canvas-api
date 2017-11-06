const express = require('express')
const app = express()
const mongoose = require('mongoose')

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listen on port ${process.env.PORT || 3000}`)
})
