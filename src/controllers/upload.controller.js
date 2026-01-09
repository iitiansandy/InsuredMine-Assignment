
const { Worker } = require("worker_threads");
const path = require("path");

const uploadFile = (req, res) => {
  const workerPath = path.join(__dirname, "../workers/import.worker.js");
  const worker = new Worker(workerPath, {
    workerData: { filePath: req.file.path }
  });

  worker.on("message", msg => res.json(msg));
  worker.on("error", err => res.status(500).json({ error: err.message }));
};

module.exports = { uploadFile };
