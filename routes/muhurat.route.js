const express = require("express");
const muhuratController = require("../controllers/muhurat.controller");
const router = express.Router();

router.get("/", muhuratController.getMuhuratData);

module.exports = router;
