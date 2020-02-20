const mongoose = require("mongoose")
require('dotenv').config()

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: false,
    useCreateIndex: true
  })
  .then(() => console.log('DB connected'))
  .catch(err => console.log('DB connection err', err))

mongoose.Promise = Promise;

module.exports = mongoose