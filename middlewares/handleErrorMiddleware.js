const handleErrorMiddleware = (err,req,res,next) =>{
  res.status(err.statuscode||500).json({msg: err.message || "something went wrong with server"})
}
module.exports = handleErrorMiddleware