
const mongoose = require("mongoose");

// Ensure related models are registered before population
require("./User");
require("./PolicyCategory");
require("./PolicyCarrier");
require("./Agent");
require("./UserAccount");

const PolicySchema = new mongoose.Schema({
  policyNumber: String,
  startDate: Date,
  endDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "PolicyCategory" },
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: "Carrier" },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "UserAccount" }
}, { timestamps: true });

module.exports = mongoose.model("Policy", PolicySchema);
