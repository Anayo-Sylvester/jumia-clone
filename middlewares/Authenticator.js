const jwt = require('jsonwebtoken')
const error = require("../errors/index");
require('dotenv').config();

const Authenticator = (req,res,next)=>{
  try{
    const {authorization} = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")){
      error.unAuthorized('You are not Authenticated to access this');
    }
    const token = authorization.split(" ")[1];
    const user = jwt.verify(token,process.env.JWT_SECRET);
    res.user = user.id;
    next();
  }catch(err){
    console.log({err})
    next(err);
  };
}

module.exports = Authenticator;