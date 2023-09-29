const express = require("express");
const paymentController = require("../controllers/payment.controller");
const router = express.Router();

router.get("/all", paymentController.getAllPayments);
router.post("/save", paymentController.savePayment);

module.exports = router;
