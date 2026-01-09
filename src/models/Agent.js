const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema({
  agentName: String,
}, { timestamps: true });

module.exports = mongoose.model("Agent", AgentSchema);