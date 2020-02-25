const mongoose = require('../db/connection')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    trim: true,
    required: true,
    maxlength: 32
  },
  category: {
    ref: 'Category',
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  quantity: {
    type: Number
  },
  photo: {
    data: Buffer,
    contentType: String
  }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)