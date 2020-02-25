const Product = require('../models/product')
const _ = require('lodash')
const formidable = require('formidable')
const fs = require('fs')

exports.all = (req, res) => {
  Product.find().then(data => res.json(data))
}
exports.create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      })
    }
    const { name, description, price, category, quantity } = fields
    if (!name || !description || !category || !quantity || !price) {
      return res.status(400).json({
        error: 'All fields are required'
      })
    }
    let product = new Product(fields)
    if (files.photo) {
      product.photo.data = fs.readFileSync(files.photo.path)
      product.photo.contentType = files.photo.type
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        })
      }
      res.json(result)
    })
  })
}
exports.byId = (req, res) => {
  Product
    .findOne({ _id: req.params._id })
    .populate('category', 'name')
    .then(data => res.json(data))
}
exports.updateProduct = (req, res) => {
  Product.findOne({ _id: req.params._id }).then(product => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(404).json({ error: 'image could not be upload' })
      }
      if (files.photo) {
        product.photo.data = fs.readFileSync(files.photo.path)
        product.photo.contentType = files.photo.type
      }
      product = _.extend(product, fields)
      // console.log("product", product)
      product.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err
          })
        }
        res.json(result)
      })
    })
  })
}
exports.deleteProduct = (req, res) => {
  Product
    .deleteOne({ _id: req.params._id })
    .then(() => Product.find().then(pro => res.json(pro))
      .then(() => res.redirect(303, "/")))
}
exports.photoProduct = (req, res) => {
  Product
    .findOne({ _id: req.params._id })
    .then(product => {
      if (product.photo.data) {
        res.set('Content-Type', product.photo.contentType)
        return res.send(product.photo.data)
      }
    })
}
