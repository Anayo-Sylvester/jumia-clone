require('express-async-errors');

const asyncWrapper = require('../middlewares/async-wrapper');
const Users = require('../models/Users');
const error = require('../errors/index');
const { StatusCodes } = require('http-status-codes');

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

const register = asyncWrapper(async (req, res) => {
  const {password, email, username} = req.body;
  await Users.create({password,email,username});
  res.status(StatusCodes.CREATED).json({msg: "registration successful, please login now"});
});

module.exports = { login, register };
