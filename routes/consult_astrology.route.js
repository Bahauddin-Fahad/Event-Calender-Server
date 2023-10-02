const express = require("express");
const consultAstrologyController = require("../controllers/consult_astrology.controller");
const router = express.Router();

router.get("/all", consultAstrologyController.getConsultAstrologyData);
router.post("/save", consultAstrologyController.saveConsultAstrologyData);

module.exports = router;
