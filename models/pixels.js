const mongoose = require('mongoose')

const pixelSchema = new mongoose.Schema(
  {
    x: Number,
    y: Number,
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    color: String,
    draws: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
)

mongoose.model('pixels', pixelSchema)
