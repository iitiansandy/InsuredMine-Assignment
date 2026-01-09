
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: String,
  dob: Date,
  address: String,
  phone: String,
  state: String,
  zip: String,
  email: String,
  gender: String,
  userType: String
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
