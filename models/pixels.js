const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')

const pixelSchema = new mongoose.Schema(
  {
    x: Number,
    y: Number,
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rCol: Number,
    gCol: Number,
    bCol: Number,
    draws: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
)
pixelSchema.plugin(findOrCreate)

mongoose.model('pixels', pixelSchema)
