const express = require("express");
const holidayController = require("../controllers/holiday.controller");
const router = express.Router();

router.get("/", holidayController.getHolidayData);

module.exports = router;
