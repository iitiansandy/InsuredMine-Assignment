const ScheduledMessage = require("../models/ScheduledMessage");

const createScheduledMessage = async ({ message, day, time }) => {
  /**
   * day: 2026-01-15
   * time: 18:30
   */
  const executeAt = new Date(`${day}T${time}:00`);

  return ScheduledMessage.create({
    message,
    executeAt
  });
};

module.exports = { createScheduledMessage };