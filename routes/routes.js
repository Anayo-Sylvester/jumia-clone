const express = require('express');
const router = express.Router();

const {getProducts,getSingleProduct,createProduct,updateProduct,deleteProduct,getCategories} = require('../controllers/products')

router.route('/').get(getProducts).post(createProduct);
router.route('/category').get(getCategories);
router.route("/category/:categoryName").get(getProducts);
router.route('/:id').get(getSingleProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router