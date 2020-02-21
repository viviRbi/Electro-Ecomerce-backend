const mongoose = require("mongoose")
require('dotenv').config()

let mongoURL = ''
if (process.env.NODE_ENV === 'development') {
  mongoURL = "mongodb://localhost/project_final"
} else {
  mongoURL = process.env.DATABASE
}

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: false,
    useCreateIndex: true
  })
  .then(() => console.log('DB connected'))
  .catch(err => console.log('DB connection err', err))

mongoose.Promise = Promise;

module.exports = mongoose