const express = require("express");
const { processPayment } = require("../controllers/paymentControllers");
const router = express.Router();

router.post("/process-payment", processPayment);

module.exports = router;
