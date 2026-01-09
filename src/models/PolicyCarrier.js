const mongoose = require("mongoose");

const PolicyCarrierSchema = new mongoose.Schema({
  companyName: String,
}, { timestamps: true });

module.exports = mongoose.model("Carrier", PolicyCarrierSchema);