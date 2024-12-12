/**
 * Defines the schema for a product document in the MongoDB database.
 * 
 * The schema includes the following fields:
 * - name: The name of the product (required)
 * - description: A description of the product (default is an empty string)
 * - image: The URL of the product image (required)
 * - brand: The brand of the product (default is undefined)
 * - category: The category of the product (required, must be one of the allowed categories)
 * - currentPrice: The current price of the product (required)
 * - prevPrice: The previous price of the product
 * - initialQuantity: The initial quantity of the product (required)
 * - AmountOrdered: The amount of the product that has been ordered
 * 
 * The schema also includes timestamps for when the product was created and updated.
 */
const mongoose = require('mongoose');

const categories = [
  'appliances',
  'phones & tablets',
  'health & beauty',
  'home & office',
  'electronics',
  'fashion',
  'computing',
  'baby products',
  'gaming',
  'musical instruments', 
  "generators & portable power",
];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    description: {
      type: String,
      default:"",
      trim: true,
    },
    image:{
      type:String,
      required: true
    },
    brand: {
      type: String,
      default: undefined,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: categories,
        message: 'Category inputted is not allowed'
      }
    },
    currentPrice: {
      type: Number,
      required: [true, 'Current price is required']
    },
    prevPrice: {
      type: Number,
    },
    initialQuantity: {
      type: Number,
      required: [true, 'Quantity is required']
    },
    AmountOrdered: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);