const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middlewares/async-wrapper");
const Order = require('../models/Orders');
const error = require("../errors/index");


const createOrder = asyncWrapper(
  async(req,res)=>{
    const data = {
      items, //array of items
      totalAmount,
      orderStatus,
      paymentDetails: { method, paymentStatus},
      shippingAddress: { street, city, state, country }
    } = req.body;
    data.createdBy = res.user;
    const newProduct = await Order.create(data) 
    res.status(StatusCodes.CREATED).json({Hit:newProduct,nbHit:newProduct.length})
  }
)

const getOrders = asyncWrapper(
  async(req,res)=>{
    const userId = res.user;
    const products = await Order.find({createdBy: userId});
    res.status(StatusCodes.OK).json({Hit:products,nbHit:products.length});
  }
)

const getSingleOrder = asyncWrapper(
  async(req,res)=>{
    const userId = res.user;
    const {id: productId} = req.params;
    const products = await Order.find({createdBy: userId, _id:productId});
    res.status(StatusCodes.OK).json({Hit:products});
  }
)


module.exports = {createOrder, getOrders, getSingleOrder};