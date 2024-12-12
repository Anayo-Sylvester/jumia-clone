/**
 * Provides functions for managing a user's shopping cart.
 *
 * @module controllers/cart
 */

require('express-async-errors');

const asyncWrapper = require('../middlewares/async-wrapper');
const cart = require('../models/Cart');
const error = require('../errors/index');
const { StatusCodes } = require('http-status-codes');

/**
 * Retrieves the items in the user's shopping cart.
 *
 * @function getItems
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} - Sends a JSON response with the cart items and the number of hits.
 */
const getItems = asyncWrapper(
  async(req,res)=>{
    const id = res.user;
    const items = await cart.find({createdBy:id})
    res.status(StatusCodes.OK).json({Hits: items, nbHits: items.length});
  }
);

/**
 * Creates a new item in the user's shopping cart.
 *
 * @function createItem
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} - Sends a 201 Created status.
 */
const createItem = asyncWrapper(
  async(req,res)=>{
    const {productId,quantity} = req.body;
    const id = res.user;
    await cart.create({productId,quantity,createdBy:id});
    res.status(StatusCodes.CREATED).send();
  }
);

/**
 * Deletes an item from the user's shopping cart.
 *
 * @function deleteItem
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} - Sends a 200 OK status.
 */
const deleteItem = asyncWrapper(
  async(req,res)=>{
    const {id: itemId} = req.params
    const isDeleted = await cart.findByIdAndDelete(itemId);
    !isDeleted && error.notFoundError(`No Item with id:${itemId} found`);
    res.status(StatusCodes.OK).send();
  }
);

/**
 * Updates the quantity of an item in the user's shopping cart.
 *
 * @function updateItem
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} - Sends a JSON response with the updated item.
 */
const updateItem = asyncWrapper(
  async(req,res)=>{
    const {quantity} = req.body;
    const {id: itemId} = req.params

    const updatedProduct = await cart.findByIdAndUpdate(
      itemId,
      { $set: { quantity: quantity } },
      { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({item: updatedProduct});
  }
);

module.exports = {createItem,deleteItem,updateItem,getItems};