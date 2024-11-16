const { Mongoose, default: mongoose } = require("mongoose")

const connectDB = (url)=>{
  mongoose.connect(url);
}

module.exports = connectDB