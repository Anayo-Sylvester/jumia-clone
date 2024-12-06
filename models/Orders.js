const { default: mongoose } = require("mongoose");

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
  orderStatus: {
    type: String,
    enum: {
      values: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Canceled'],
      message: 'Order status must be one of Pending, Paid, Shipped, Delivered, or Canceled',
    },
    default: 'Pending',
  },
  paymentDetails: {
    method: {
      type: String,
      enum: {
        values: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Other'],
        message: 'Payment method must be one of Credit Card, Debit Card, PayPal, Bank Transfer, or Other',
      },
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Completed', 'Failed', 'Refunded'],
        message: 'Payment status must be one of Pending, Completed, Failed, or Refunded',
      },
      default: 'Pending',
    },
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
      minlength: [2, 'State name must be at least 2 characters'],
      maxlength: [50, 'State name cannot exceed 50 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      minlength: [2, 'Country name must be at least 2 characters'],
      maxlength: [50, 'Country name cannot exceed 50 characters'],
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('Orders', orderSchema);
