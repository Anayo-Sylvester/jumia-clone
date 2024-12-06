const express = require('express');
const router = express.Router();

const {createOrder,getOrders,getSingleOrder} = require('../controllers/order.js');

router.route('/').get(getOrders).post(createOrder);
router.route('/:id').get(getSingleOrder);

module.exports = router;