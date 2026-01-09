const cron = require("node-cron");
const ScheduledMessage = require("../models/ScheduledMessage");

/**
 * Runs every minute
 */
const startMessageCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const messages = await ScheduledMessage.find({
        executeAt: { $lte: now },
        executed: false
      });

      for (const msg of messages) {
        /**
         * EXECUTION LOGIC
         * Replace this with:
         * - email sending
         * - notification
         * - webhook
         */
        console.log("Executing message:", msg.message);

        msg.executed = true;
        msg.executedAt = new Date();
        await msg.save();
      }
      console.log(`Cron checked at ${now.toISOString()}, executed ${messages.length} messages.`);
    } catch (error) {
      console.error("Cron execution failed:", error);
    }
  });
};

module.exports = { startMessageCron };