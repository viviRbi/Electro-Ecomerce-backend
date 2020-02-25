const express = require('express')
const router = express.Router()
const { all, create, byId, deleteProduct, updateProduct, photoProduct } = require('../controllers/product')

router.get('/', all)
router.post('/create', create)
router.get('/detail/:_id', byId)
router.put('/update/:_id', updateProduct)
router.delete('/delete/:_id', deleteProduct)
router.get('/photo/:_id', photoProduct)

module.exports = router