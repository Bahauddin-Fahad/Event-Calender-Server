const express = require("express");
const promotionController = require("../../controllers/bhakti/promotion.controller");
const router = express.Router();

router.get("/all", promotionController.getAllPromotionData);
router.post("/add", promotionController.addPromotionData);
router.put("/edit/:id", promotionController.editPromotionData);
router.delete("/delete/:id", promotionController.deletePromotionData);

module.exports = router;
