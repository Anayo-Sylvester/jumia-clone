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
const mongoose = require('mongoose');

/**
 * Retrieves the items in the user's shopping cart.
 *
 * @function getItems
 * @async
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} - Sends a JSON response with the cart items and the number of hits.
 */

const getItems = asyncWrapper(async (req, res) => {
  const id = res.user; // Retrieve user ID from response object
  const userId = new mongoose.Types.ObjectId(`${id}`); // Convert user ID to string to remove depreciated warning since it happens when id is number then converts to ObjectId
  
  // Use aggregation to join cart items with their respective product details
  const items = await cart.aggregate([
    {
      $match: { createdBy: userId } // Filter by user ID
    },
    {
      $lookup: {
        from: "products", // Name of the product collection
        let: { productId: { $toObjectId: "$productId" } }, // Convert productId to ObjectId
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$productId"] } // Match converted productId with _id in products
            }
          }
        ],
        as: "productDetails" // Output array field for joined data
      }
    },
    {
      $unwind: "$productDetails" // Flatten the joined array to simplify access
    },
    {
      $project: {
        _id: 1, // Include cart item ID
        productId: 1, // Include product ID
        quantity: 1, // Include cart quantity
        "productDetails.name": 1, // Include product name
        "productDetails.currentPrice": 1, // Include product price
        "productDetails.image": 1, // Include product image
        instock: {
          $gt: [
            { $subtract: ["$productDetails.initialQuantity", "$productDetails.AmountOrdered"] },
            0
          ]
        }
      }
    }
  ]);

  res.status(StatusCodes.OK).json({ Hits: items, nbHits: items.length });
});

const checkIfItemExist = asyncWrapper(
  async(req,res)=>{
    const {id:productId} = req.params;
    const id = res.user;
    const item = await cart.findOne({productId,createdBy:id});
    item ? res.status(StatusCodes.NO_CONTENT).send('') : res.status(StatusCodes.NOT_FOUND).send('');
  }
)
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
    const isDeleted = await cart.findOneAndDelete({productId:itemId});
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

module.exports = {createItem,deleteItem,updateItem,getItems,checkIfItemExist};