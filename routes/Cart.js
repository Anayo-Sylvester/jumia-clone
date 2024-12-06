const express = require('express');
const router = express.Router();

const {createItem,getItems,deleteItem,updateItem} = require('../controllers/cart');

router.route('/').get(getItems).post(createItem);
router.route('/:id').patch(updateItem).delete(deleteItem);

module.exports = router;