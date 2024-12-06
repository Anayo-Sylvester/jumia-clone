const {StatusCodes} = require('http-status-codes');

const handleErrorMiddleware = (err,req,res,next) =>{
  if(err.name === "CastError"){
    err.statusCode = StatusCodes.NOT_FOUND
    err.message = `Item not found`
  }
  if (err.name === "ValidationError") {
    err.statusCode = StatusCodes.BAD_REQUEST;
    err.message = Object.values(err.errors).map(item=>item.message).join(", ");
  }
  if(err.code === 11000){
    err.statusCode = StatusCodes.CONFLICT;
    err.message = `${err.keyValue.email} already exists`;
  }
  res.status(err.statusCode||500).json({msg: err.message || "something went wrong with server"})
}
module.exports = handleErrorMiddleware