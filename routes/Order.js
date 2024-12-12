/**
 * Defines the routes for handling order-related requests.
 * 
 * @module routes/Order
 */

const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getSingleOrder } = require('../controllers/order');

/**
 * GET /orders - Retrieves a list of all orders.
 * POST /orders - Creates a new order.
 */
router.route('/').get(getOrders).post(createOrder);

/**
 * GET /orders/:id - Retrieves a single order by its ID.
 */
router.route('/:id').get(getSingleOrder);

module.exports = router;