const User = require('../models/user');
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.signup = (req, res) => {
  const { name, email, password } = req.body
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({ error: 'Email is taken' })
    }
    const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' })
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Acount activation link from Electro E-comerce`,
      html: `
      <p>Please use the following link to activate your account</p>
      <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
      <hr/>
      <p>This email may contain sensitive information</p>
      <p>${process.env.CLIENT_URL}</p>
      `
    }
    sgMail.send(emailData).then(sent => {
      return res.json({
        message: `Email has been sent to ${email}.`,
      })
    })
      .catch(err => {
        return res.json({
          message: err.message
        })
      })
  })
};
exports.accountActivation = (req, res) => {
  const { token } = req.body
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
      if (err) {
        console.log('JWT VERTIFY ERR', err)
        return res.status(401).json({
          error: 'Expired link. Sign up again'
        })
      }
      const { name, email, password } = jwt.decode(token)
      const user = new User({ name, email, password })
      user.save((err, user) => {
        if (err) {
          console.log('ERR SAVE USER IN ACCOUNT ACTIVATION')
          return res.status(401).json({
            error: 'Error saving user in database. You have already activated this link'
          })
        }
        return res.json({
          message: 'Signup success. Please sign in'
        })
      })
    })
  } else {
    return res.json({
      message: 'Something went wrong'
    })
  }
}

exports.signin = (req, res) => {
  const { email, password } = req.body
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist'
      })
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match'
      })
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    const { _id, name, email, role } = user
    //if success, send this json to frontend. It'll be store in res.data : axios().then(res=> res.data)
    return res.json({
      token,
      user: { _id, name, email, role }
    })
  })
}

exports.forgotPassword = (req, res) => {
  const { email } = req.body
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist'
      })
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' })
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Reset password link from Electro E-comerce`,
      html: `
      <p>Hi ${user.name}. Please use the following link to reset your password</p>
      <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
      <hr/>
      <p>This email may contain sensitive information</p>
      <p>${process.env.CLIENT_URL}</p>
      `
    }
    //push token from the singed user._id to resetPassword link in that user (schema)
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: 'Database error on user password forgot request'
        })
      } else {
        sgMail.send(emailData).then(sent => {
          return res.json({
            message: `Email has been sent to ${email}.`,
          })
        })
      }
    })
  })
}
exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body
  if (resetPasswordLink) {
    // verify if it the same with the jwt.sign
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (err, decoded) {
      if (err) {
        return res.status(400).json({
          error: 'Expired link. Try again'
        })
      }
      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          res.status(400).json({
            error: 'Something went wrong. Try later'
          })
        }
        const updatedFields = {
          password: newPassword,
          resetPasswordLink: ''
        }
        user = _.extend(user, updatedFields)
        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: 'Error reseting user password'
            })
          }
          res.json({ message: 'Your password had been reset' })
        })
      })
    })
  }
}