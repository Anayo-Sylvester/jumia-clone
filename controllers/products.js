require('express-async-errors');

const asyncWrapper = require('../middlewares/async-wrapper');
const Utility = require('../utils/utils')

const Product = require('../models/model');
const { query } = require('express');


const getProducts = asyncWrapper(
  async (req, res) => {
    const { categoryName } = req.params;
    let { page, limit, search, sort, select, price} = req.query;
    let restructuredSort;

    const filterObject = {};

    // Build filter object based on query params
    if(categoryName){
      filterObject.category = categoryName;
    }
    if (search) {
      filterObject.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (sort){
      restructuredSort = Utility.commaSeparator(sort);
    }
    if (price){
      const {min,max} = Utility.convertPriceToMInAndMax(price);
      filterObject.currentPrice = {$gte:min,$lte:max}
    }


    // Set default values for pagination
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    console.log(filterObject);

    // Get the total count of matching documents
    const totalCount = await Product.countDocuments(filterObject);

    // Get the paginated data
    const products = await Product.find(filterObject)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(restructuredSort||{})
      .select(select||{})

    // Send the response with total count and paginated data
    res.status(200).json({
      totalItems: totalCount, // Total matching documents
      page,
      nbPages: Math.ceil(totalCount/limit),//the number of pages
      limit,
      hitsPerPage: products.length, // Number of items on this page
      hits: products,
    });
  }
);

// Function to get distinct categories
const getCategories = asyncWrapper(
  async (req, res) => {
    const categories = await Product.distinct('category'); // gets all categories and avoids duplicate
    res.status(200).json({ nbHITS: categories.length,hits: categories});
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

module.exports = {getProducts,getSingleProduct,createProduct,updateProduct,deleteProduct,getCategories}