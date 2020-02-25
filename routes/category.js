const express = require('express')
const router = express.Router()
const { create, detail, categories } = require('../controllers/category')

router.post('/create', create)
router.get('/detail/:_id', detail)
router.get('/', categories)

module.exports = router