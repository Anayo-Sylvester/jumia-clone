require('express-async-errors');

const asyncWrapper = require('../middlewares/async-wrapper');
const Utility = require('../utils/utils')

const Product = require('../models/model');

const getProducts = asyncWrapper(async (req, res) => {
  const { categoryName } = req.params;
  let { page, limit, search, sort, select, price, discount,brand } = req.query;
  let restructuredSort;

  const filterObject = {};

  // Build filter object based on query params
  if (categoryName) {
    filterObject.category = Utility.commaSeparator(categoryName);
  }
  if (search) {
    filterObject.name = { $regex: search, $options: "i" }; // Case-insensitive search
  }
  if (sort) {
    restructuredSort = Utility.commaSeparator(sort);
    if(discount){
      let sortObject = {}
        restructuredSort.split(" ").forEach(val=>{
          sortObject[val] = 1;
        })
      restructuredSort = sortObject;
    }
    console.log(restructuredSort )
  }
  if (select) {
    select = Utility.commaSeparator(select);
  }
  if (brand) {
    filterObject.brand = Utility.commaSeparator(brand);
  }
  if (price) {
    const { min, max } = Utility.convertPriceToMinAndMax(price);
    filterObject.currentPrice = { $gte: min, $lte: max };
  }

  // Set default values for pagination
  page = Number(page) || 1;
  limit = Number(limit) || 12;

  // Get the total count of matching documents
  let totalCount;

  let products;

  // Check if discount query parameter is provided
  if (discount) {
    const discountMatch = {
      ...filterObject,
      $expr: {
        $gte: [
          {
            $divide: [
              { $subtract: ["$prevPrice", "$currentPrice"] },
              "$prevPrice",
            ],
          },
          parseFloat(discount) / 100, // Convert percentage to decimal
        ],
      },
    };

    // Calculate total count using aggregation
    const totalAggregation = await Product.aggregate([
      { $match: discountMatch },
      { $count: "totalCount" },
    ]);

    totalCount = totalAggregation.length > 0 ? totalAggregation[0].totalCount : 0;

    // Fetch paginated products using aggregation
    products = await Product.aggregate([
      { $match: discountMatch }, // Apply discount filter
      { $sort: restructuredSort || { currentPrice: 1 } }, // Apply sorting
      { $skip: (page - 1) * limit }, // Apply pagination skip
      { $limit: limit }, // Apply pagination limit
      ...(select ? [{ $project: Utility.parseProjection(select) }] : []), // Apply dynamic field selection
    ]);
  } else {
    // Calculate total count without discount filter
    totalCount = await Product.countDocuments(filterObject);

    // Fetch paginated products using `.find()`
    products = await Product.find(filterObject)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(restructuredSort || {})
      .select(select || {});
  }


  // Send the response with total count and paginated data
  res.status(200).json({
    totalItems: totalCount, // Total matching documents
    page,
    nbPages: Math.ceil(totalCount / limit), // Total number of pages
    limit,
    hitsPerPage: products.length, // Number of items on this page
    hits: products,
  });
});


// Function to get distinct categories
const getCategories = asyncWrapper(
  async (req, res) => {
    const categories = await Product.distinct('category'); // gets all categories and avoids duplicate
    res.status(200).json({ nbHITS: categories.length,hits: categories});
  }
);



const getSingleProduct = asyncWrapper(
  async(req,res)=>{
    const {id} = await req.params;
    let {select} = await req.query;
    if(select){
      select = Utility.commaSeparator(select);
    }
    const product = await Product.findById(id).select(select || {});

    // if product with id does not exist error is thrown
    if(!product){
      const error = new Error('No item Found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({nhBITS: product.length, hit:product})
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