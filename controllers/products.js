require('express-async-errors');

const asyncWrapper = require('../middlewares/async-wrapper');
const Utility = require('../utils/utils')

const Product = require('../models/model')


const getAllProduct = asyncWrapper(
  async(req,res)=>{
    const products = await Product.find({});
    res.status(200).json({nhBITS: products.length, data:{products}})
  }
);

const getSingleProduct = asyncWrapper(
  async(req,res)=>{
    const {id} = req.params;
    const products = await Product.findById(id);

    // if product with id does not exist error is thrown
    if(!products.length){
      const error = new Error('No item Found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({nhBITS: products.length, data:{products}})
  }
);

const createProduct = asyncWrapper(
  async(req,res)=>{
    await Product.create (Utility.filterObject(req.body))
    res.status(201).json({"msg":"product created successfully"})
  }
);

const updateProduct = asyncWrapper(
  async(req,res)=>{
    const {id} = req.params;
    await Product.findByIdAndUpdate(id,Utility.filterObject(req.body));
    res.status(200).json({"msg":"product successfully updated"})
  }
);

const deleteProduct = asyncWrapper(
  async(req,res)=>{
    const {id} = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({"msg":"product deleted successfully"})
  }
);

module.exports = {getAllProduct,getSingleProduct,createProduct,updateProduct,deleteProduct}