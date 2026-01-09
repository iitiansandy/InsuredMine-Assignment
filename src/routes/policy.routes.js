
const { Router } = require("express");
const { searchByUsername, aggregateByUser } = require("../controllers/policy.controller.js");

const router = Router();
router.get("/search", searchByUsername);
router.get("/aggregate", aggregateByUser);
module.exports = router;
