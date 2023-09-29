const express = require("express");
const festivalController = require("../controllers/festival.controller");
const router = express.Router();

router.get("/", festivalController.getFestivalData);

module.exports = router;
