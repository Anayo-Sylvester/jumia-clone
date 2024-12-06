const mongoose = require('mongoose');
const error = require('../errors/index');

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a valid ID"],
    ref: 'Product', // Optional: use if itemId references another model
  },
  quantity: {
    type: Number,
    required: [true, "Please enter Quantity"],
    min: [1, "Quantity must be at least 1"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide user id"],
    ref: 'Users'
  }
},{timestamps:true});

cartSchema.pre('save',async function(next){
  const doesItemExist = await mongoose.model('Cart').findOne({productId: this.productId, createdBy: this.createdBy});
  doesItemExist && error.conflict("Item already exist in cart");
  next();
})

module.exports = mongoose.model("Cart",cartSchema);