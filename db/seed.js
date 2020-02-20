const User = require('../models/user');
const mongoose = require('./connection')

User.deleteMany({})
  .then(() => {
    return User.insertMany([
      {
        name: "Vy",
        email: "sdsds@gmail.com",
        password: "sdsds"
      },
      {
        name: "aaa",
        email: "aaa@gmail.com",
        password: "aaa"
      }
    ])
  }
  ).then(() => console.log('created'))