const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide name"],
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [30, "Name cannot exceed 30 characters"]
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    minlength: [3, "Email must have at least 3 characters"],
    maxlength: [254, "Email must not exceed 254 characters"],
    match: [
      /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/,
      "Please provide a valid email address"
    ],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must have at least 8 characters"],
    match: [
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[#?!@$%^&*-])[A-Za-z\d#?!@$%^&*-]{8,}$/,
      "Password must contain at least one letter, one number, and one special character (#, ?, !, @, $, %, ^, &, *, -)"
    ]
  }
},{timestamps:true});

userSchema.pre('save', async function (next) {
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = await bcrypt.hashSync(this.password, salt);
    this.password = encryptedPassword;
  next();
},{timestamps: true});

userSchema.methods.generateJWT = function (){
  const payload = {
    id: this.id
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TTL });
  return token;
}

userSchema.methods.validatePassword = async function(inputtedPassword){
  isMatch = await bcrypt.compare(inputtedPassword,this.password);
  return isMatch;
}

module.exports = mongoose.model("Users",userSchema);