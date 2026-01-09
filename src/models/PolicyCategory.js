const mongoose = require("mongoose");

const PolicyCategorySchema = new mongoose.Schema({
  categoryName: String,
}, { timestamps: true });

module.exports = mongoose.model("PolicyCategory", PolicyCategorySchema);