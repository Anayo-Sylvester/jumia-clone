/**
 * Defines the routes for authentication-related functionality, including login and registration.
 * 
 * @module routes/Auth
 */

/**
 * Handles user login requests.
 * 
 * @name POST /login
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

/**
 * Handles user registration requests.
 * 
 * @name POST /register
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const express = require('express');
const router = express.Router();

const { login, register, validateToken } = require('../controllers/auth');
const Authenticator = require('../middlewares/Authenticator');

router.route('/login').post(login);
router.route("/register").post(register);
router.route("/validate-token").post(Authenticator,validateToken);

module.exports = router