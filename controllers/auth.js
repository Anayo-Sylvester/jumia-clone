/**
 * Handles user authentication, including login and registration.
 *
 * @module controllers/auth
 */

require('express-async-errors');

const asyncWrapper = require('../middlewares/async-wrapper');
const Users = require('../models/Users');
const error = require('../errors/index');
const { StatusCodes } = require('http-status-codes');

/**
 * Logs in a user by verifying their email and password.
 *
 * @param {Object} req - The Express request object.
 * @param {string} req.body.email - The user's email address.
 * @param {string} req.body.password - The user's password.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} - A JSON response containing the user's username and a JWT token.
 */
const login = asyncWrapper(async (req, res) => {
  const {email,password} = req.body;
  if(!email.trim() || !password.trim()){
    error.badRequestError("Enter email and password")
  }
  const user = await Users.findOne({email});
  !user && error.unAuthorized("Incorrect email or password");

  if (await user.validatePassword(password)){
    res.status(StatusCodes.OK).json({username:user.username,token: user.generateJWT()});
  }else{
    error.unAuthorized("Incorrect email or password")
  }
});

/**
 * Registers a new user by creating a new user account.
 *
 * @param {Object} req - The Express request object.
 * @param {string} req.body.password - The user's password.
 * @param {string} req.body.email - The user's email address.
 * @param {string} req.body.username - The user's username.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} - A JSON response indicating successful registration.
 */
const register = asyncWrapper(async (req, res) => {
  const {password, email, username} = req.body;
  await Users.create({password,email,username});
  res.status(StatusCodes.CREATED).json({msg: "registration successful, please login now"});
});

const validateToken = asyncWrapper(async (req, res) => {
  const user = res.user;
  console.log(user);
  res.status(StatusCodes.OK).send();
});

module.exports = { login, register, validateToken };
