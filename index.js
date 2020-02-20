const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const bodyParser = require('body-parser')
require('dotenv').config()

// app middleware
app.use(morgan('dev'))
app.use(bodyParser.json())

if (process.env.NODE_ENV = 'development') {
  app.use(cors({ origin: `http://localhost:3000` }))
}
app.use('/api', authRoutes)

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`API is running on port ${port}-${process.env.NODE_ENV}`))
