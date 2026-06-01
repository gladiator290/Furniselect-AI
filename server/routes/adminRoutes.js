const express = require("express");

const {
  getDashboardStats,
  getAnalytics,
} = require("../controllers/adminController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  admin,
  getDashboardStats
);

router.get(
  "/analytics",
  protect,
  admin,
  getAnalytics
);

module.exports = router;