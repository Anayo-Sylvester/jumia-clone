const { StatusCodes } = require("http-status-codes");
const asyncWrapper = require("../middlewares/async-wrapper");
const Order = require('../models/Orders');
const error = require("../errors/index");

/**
 * Handles the creation of a new order.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing the order details.
 * @param {Array} req.body.items - The array of items in the order.
 * @param {number} req.body.totalAmount - The total amount of the order.
 * @param {string} req.body.orderStatus - The status of the order.
 * @param {Object} req.body.paymentDetails - The payment details for the order.
 * @param {string} req.body.paymentDetails.method - The payment method used.
 * @param {string} req.body.paymentDetails.paymentStatus - The status of the payment.
 * @param {Object} req.body.shippingAddress - The shipping address for the order.
 * @param {string} req.body.shippingAddress.street - The street address.
 * @param {string} req.body.shippingAddress.city - The city.
 * @param {string} req.body.shippingAddress.state - The state.
 * @param {string} req.body.shippingAddress.country - The country.
 * @param {Object} res - The HTTP response object.
 * @param {Object} res.user - The user who created the order.
 * @returns {Object} - The created order.
 */
const createOrder = asyncWrapper(async (req, res) => {
  const {
    items, // Array of items
    totalAmount,
    orderStatus,
    paymentDetails: { method, paymentStatus },
    shippingAddress: { street, city, state, country },
  } = req.body;

  const data = {
    items,
    totalAmount,
    orderStatus,
    paymentDetails: { method, paymentStatus },
    shippingAddress: { street, city, state, country },
    createdBy: res.user, // Set the user as the creator of the order
  };

  const newOrder = await Order.create(data);
  res.status(StatusCodes.CREATED).json({ order: newOrder });
});

/**
 * Retrieves all orders for the current user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Object} res.user - The user whose orders are being retrieved.
 * @returns {Object} - An object containing the retrieved orders.
 */
const getOrders = asyncWrapper(async (req, res) => {
  const userId = res.user;
  const orders = await Order.find({ createdBy: userId });

  res.status(StatusCodes.OK).json({
    orders,
    totalOrders: orders.length,
  });
});

/**
 * Retrieves a single order for the current user.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the order to retrieve.
 * @param {Object} res - The HTTP response object.
 * @param {Object} res.user - The user whose order is being retrieved.
 * @returns {Object} - The retrieved order.
 */
const getSingleOrder = asyncWrapper(async (req, res) => {
  const userId = res.user;
  const { id: orderId } = req.params;

  const order = await Order.findOne({ createdBy: userId, _id: orderId });

  if (!order) {
    throw new error.NotFoundError(`No order found with ID: ${orderId}`);
  }

  res.status(StatusCodes.OK).json({ order });
});

module.exports = { createOrder, getOrders, getSingleOrder };
