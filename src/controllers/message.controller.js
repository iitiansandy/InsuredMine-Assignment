const MessageService = require("../services/message.service");

const scheduleMessage = async (req, res) => {
  try {
    const { message, day, time } = req.body;

    if (!message || !day || !time) {
      return res.status(400).json({
        message: "message, day and time are required"
      });
    }

    const data = await MessageService.createScheduledMessage({
      message,
      day,
      time
    });

    return res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { scheduleMessage };