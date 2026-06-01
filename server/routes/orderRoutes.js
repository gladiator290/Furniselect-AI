const express = require("express");

const {
  placeOrder,
  getMyOrders,
  getAllOrders,

  approveOrder,
  rejectOrder,

  shipOrder,
  deliverOrder,

  adminCancelOrder,

  requestCancelOrder,
  requestReturnOrder,

  approveCancelOrder,
  rejectCancelOrder,

  approveReturnOrder,
  rejectReturnOrder,
} = require("../controllers/orderController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* Customer Routes */

router.post(
  "/",
  protect,
  placeOrder
);

router.get(
  "/",
  protect,
  getMyOrders
);

router.put(
  "/:id/cancel-request",
  protect,
  requestCancelOrder
);

router.put(
  "/:id/return-request",
  protect,
  requestReturnOrder
);

/* Admin Routes */

router.get(
  "/admin",
  protect,
  admin,
  getAllOrders
);

router.put(
  "/admin/:id/approve",
  protect,
  admin,
  approveOrder
);

router.put(
  "/admin/:id/reject",
  protect,
  admin,
  rejectOrder
);

router.put(
  "/admin/:id/ship",
  protect,
  admin,
  shipOrder
);

router.put(
  "/admin/:id/deliver",
  protect,
  admin,
  deliverOrder
);

router.put(
  "/admin/:id/cancel",
  protect,
  admin,
  adminCancelOrder
);

router.put(
  "/admin/:id/approve-cancel",
  protect,
  admin,
  approveCancelOrder
);

router.put(
  "/admin/:id/reject-cancel",
  protect,
  admin,
  rejectCancelOrder
);

router.put(
  "/admin/:id/approve-return",
  protect,
  admin,
  approveReturnOrder
);

router.put(
  "/admin/:id/reject-return",
  protect,
  admin,
  rejectReturnOrder
);

module.exports = router;