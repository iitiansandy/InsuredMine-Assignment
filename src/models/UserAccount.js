const mongoose = require("mongoose");

const UserAccountSchema = new mongoose.Schema({
  accountName: String,
}, { timestamps: true });

module.exports = mongoose.model("UserAccount", UserAccountSchema);