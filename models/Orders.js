/**
 * Defines the schema for an Order document in the MongoDB database.
 * 
 * An Order document represents a customer's order and contains the following fields:
 * - `createdBy`: The ID of the user who placed the order.
 * - `items`: An array of objects representing the products in the order, including the product ID, quantity, and price.
 * - `totalAmount`: The total amount of the order.
 * - `orderStatus`: The current status of the order (Pending, Paid, Shipped, Delivered, or Canceled).
 * - `paymentDetails`: An object containing the payment method and payment status.
 * - `shippingAddress`: An object containing the shipping address details.
 * 
 * The schema also includes timestamps for when the order was created and updated.
 */
const { default: mongoose } = require("mongoose");

const VALID_NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const orderSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: [true, 'User ID is required'],
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: [true, 'Product ID is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative'],
  },
  shippingAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      minlength: [5, 'Street address must be at least 5 characters'],
      maxlength: [100, 'Street address cannot exceed 100 characters'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      minlength: [2, 'City name must be at least 2 characters'],
      maxlength: [50, 'City name cannot exceed 50 characters'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      enum: {
        values: VALID_NIGERIAN_STATES,
        message: '{VALUE} is not a valid Nigerian state. Please enter a valid Nigerian state or FCT.'
      }
    }
  },
}, { timestamps: true });

module.exports = mongoose.model('Orders', orderSchema);
