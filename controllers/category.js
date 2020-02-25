const Category = require('../models/category')

exports.categories = (req, res) => {
  Category.find({}).then(data => res.json(data))
}
exports.create = (req, res) => {
  const category = new Category(req.body)
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err
      })
    }
    res.json({ data })
  })
}
exports.detail = (req, res) => {
  Category
    .findOne({ _id: req.params._id })
    .then((data) => res.json(data))
}

