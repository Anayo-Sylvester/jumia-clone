require('express-async-errors');

const asyncWrapper = require('../middlewares/async-wrapper');
const Utility = require('../utils/utils')

const Product = require('../models/model')


const getAllProduct = asyncWrapper(
  async (req, res) => {
    const { categoryName } = req.params;
    let { page, limit, search,sort } = req.query;
    let restructuredSort;

    const filterObject = {};

    // Build filter object based on query params
    if (categoryName) {
      filterObject.category = categoryName;
    }
    if (search) {
      filterObject.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if(sort){
      restructuredSort = sort.split(',').join(' ');
    }

    // Set default values for pagination
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    console.log(filterObject);
    console.log(req.query);

    // Get the total count of matching documents
    const totalCount = await Product.countDocuments(filterObject);

    // Get the paginated data
    const products = await Product.find(filterObject)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(restructuredSort||{})

    // Send the response with total count and paginated data
    res.status(200).json({
      totalItems: totalCount, // Total matching documents
      page,
      limit,
      itemsOnPage: products.length, // Number of items on this page
      data: products,
    });
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