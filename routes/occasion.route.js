const express = require("express");
const occasionsController = require("../controllers/occasion.controller");
const router = express.Router();

router.get("/all/:userId", occasionsController.getAllOccasions);
router.post("/create", occasionsController.createOccasion);
router.put("/edit/:id", occasionsController.editOccasion);
router.delete("/delete/:id", occasionsController.deleteOccasion);

module.exports = router;
