
const { Router } = require("express");
const uploadRoutes = require("./upload.routes.js");
const policyRoutes = require("./policy.routes.js");
const messageRoutes = require("./message.routes");

const router = Router();
router.use("/upload", uploadRoutes);
router.use("/policy", policyRoutes);
router.use("/message", messageRoutes);
module.exports = router;
