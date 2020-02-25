const Category = require('../models/category')

exports.categories = (req, res) => {
  Category.find({}).then(data => res.json(data))
}
exports.create = (req, res) => {
  Category
    .create(req.body)
    .then(() => redirect(303, "/category"))
}
exports.detail = (req, res) => {
  Category
    .findOne({ _id: req.params._id })
    .then((data) => res.json(data))
}
exports.update = (req, res) => {
  Category
    .findOneAndUpdate({ _id: req.params._id }, req.body)
    .then(() => {
      Category.find().then(cate => res.json(cate)).then(() => cate.redirect(303, "/category"))
    });
}


