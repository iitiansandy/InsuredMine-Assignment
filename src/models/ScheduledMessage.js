const mongoose = require("mongoose");

const ScheduledMessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  executeAt: {
    type: Date,
    required: true,
    index: true
  },
  executed: {
    type: Boolean,
    default: false,
    index: true
  },
  executedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("ScheduledMessage", ScheduledMessageSchema);