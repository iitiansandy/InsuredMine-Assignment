const os = require("os");
const { exec } = require("child_process");

let previousTotal = 0;
let previousIdle = 0;

function getCPUUsage() {
  const cpus = os.cpus();

  let idle = 0;
  let total = 0;

  cpus.forEach(core => {
    for (let type in core.times) {
      total += core.times[type];
    }
    idle += core.times.idle;
  });

  const idleDiff = idle - previousIdle;
  const totalDiff = total - previousTotal;

  previousIdle = idle;
  previousTotal = total;

  return totalDiff === 0 ? 0 : (100 - Math.floor((idleDiff / totalDiff) * 100));
}

function startCPUMonitor(threshold = 70, interval = 5000) {
  setInterval(() => {
    const usage = getCPUUsage();
    console.log(`CPU Usage: ${usage}%`);

    if (usage >= threshold) {
      console.error("CPU threshold exceeded. Restarting server...");

      /**
       * PM2 restart (industry standard)
       * If not using PM2, process.exit(1) is enough
       */
      exec("pm2 restart all", () => {
        process.exit(1);
      });
    }
  }, interval);
}

module.exports = { startCPUMonitor };