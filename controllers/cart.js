require('express-async-errors');

const asyncWrapper = require('../middlewares/async-wrapper');
const cart = require('../models/Cart');
const error = require('../errors/index');
const { StatusCodes } = require('http-status-codes');

const getItems = asyncWrapper(
  async(req,res)=>{
    const id = res.user;
    const items = await cart.find({createdBy:id})
    res.status(StatusCodes.OK).json({Hits: items, nbHits: items.length});
  }
)
const createItem = asyncWrapper(
  async(req,res)=>{
    const {productId,quantity} = req.body;
    const id = res.user;
    await cart.create({productId,quantity,createdBy:id});
    res.status(StatusCodes.CREATED).send();
  }
);

const deleteItem = asyncWrapper(
  async(req,res)=>{
    const {id: itemId} = req.params
    const isDeleted = await cart.findByIdAndDelete(itemId);
    !isDeleted && error.notFoundError(`No Item with id:${itemId} found`);
    res.status(StatusCodes.OK).send();
  }
);

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