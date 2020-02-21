const mongoose = require("mongoose")
require('dotenv').config()

let mongoURI = ''
if (process.env.NODE_ENV === 'development') {
  mongoURI = "mongodb://localhost/project_final"
} else {
  mongoURI = process.env.DB_URL
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: false,
    useCreateIndex: true
  })
  .then(() => console.log('DB connected', mongoURI))
  .catch(err => console.log('DB connection err', err))

mongoose.Promise = Promise;

module.exports = mongoose