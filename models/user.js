const mongoose = require('../db/connection')
const crypto = require('crypto')
// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true
  },
  hashed_password: {
    type: String,
    trim: true,
    required: true,
    max: 32
  },
  salt: String,
  role: {
    type: String,
    default: 'subscriber'
  },
  resetPasswordLink: {
    data: String,
    default: ''
  },
}, { timestamps: true })

// virtual: create a password that not mongodb schema, not in mongodb, use to combine
userSchema.virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })

//method
userSchema.methods = {
  // When user login again, use this.salt above (the salt in database) to encrypt it whith sha1 algo. 
  //The makeSalt() function isn't use this time
  authenticate: function (plainText) {
    return this.encryptPassword(plainText)
  },
  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  }
}

module.exports = mongoose.model('User', userSchema)