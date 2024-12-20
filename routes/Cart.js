/**
 * Defines the routes for managing items in a shopping cart.
 * 
 * @route GET /cart
 * @route POST /cart
 * @route PATCH /cart/:id
 * @route DELETE /cart/:id
 */
const express = require('express');
const router = express.Router();

const {createItem,getItems,deleteItem,updateItem,checkIfItemExist} = require('../controllers/cart');

router.route('/').get(getItems).post(createItem);
router.route('/:id').patch(updateItem).delete(deleteItem).get(checkIfItemExist);

module.exports = router;