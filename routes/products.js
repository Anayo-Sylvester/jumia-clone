const express = require('express');
const router = express.Router();
const Authentication = require('../middlewares/Authenticator')
const {getProducts,getSingleProduct,getCategories} = require('../controllers/products')

router.route('/').get(getProducts)
router.route('/category').get(getCategories);
router.route("/category/:categoryName").get(getProducts);
router.route('/:id').get(getSingleProduct)

// .post(createProduct);

module.exports = router