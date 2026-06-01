const express =
  require("express");

const {
  createRazorpayOrder,
  getKey,
  verifyPayment,
} = require(
  "../controllers/paymentController"
);

const router =
  express.Router();

router.post(
  "/create-order",
  createRazorpayOrder
);
router.get(
  "/key",
  getKey
);

router.post(
  "/verify",
  verifyPayment
);

module.exports = router;