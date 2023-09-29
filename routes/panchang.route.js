const express = require("express");
const panchangController = require("../controllers/panchang.controller");
const router = express.Router();

router.get("/", panchangController.getPanchangData);

module.exports = router;
