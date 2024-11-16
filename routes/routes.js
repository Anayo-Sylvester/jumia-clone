const express = require('express');
const router = express.Router();

const {getAllProduct,getSingleProduct,createProduct,updateProduct,deleteProduct} = require('../controllers/products')

router.route('/').get(getAllProduct).post(createProduct)
router.route('/:id').get(getSingleProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router