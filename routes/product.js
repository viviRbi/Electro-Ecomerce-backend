const express = require('express')
const router = express.Router()
const { create, byId, deleteProduct, updateProduct } = require('../controllers/product')

router.post('/create', create)
router.get('/detail/:_id', byId)
router.put('/update/:_id', updateProduct)
router.delete('/delete/:_id', deleteProduct)

module.exports = router