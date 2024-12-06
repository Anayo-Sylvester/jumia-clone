const mongoose = require('mongoose');

const categories = [
  'appliances',//
  'phones & tablets',//
  'health & beauty',//
  'home & office',//
  'electronics',//
  'fashion',//
  'computing',//
  'baby products',//
  'gaming',//
  'musical instruments', //
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