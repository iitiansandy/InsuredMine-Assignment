
const { Router } = require("express");
const multer = require("multer");
const { uploadFile } = require("../controllers/upload.controller.js");

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), uploadFile);
module.exports = router;
