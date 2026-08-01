const express = require("express");

const {
  getDashboardStats,
  getAnalytics,
  getAdminUsers,
  updateUserRole,
  getAdminReviews,
  deleteAdminReview,
  getSiteSettings,
  updateSiteSettings,
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

router.get("/users", protect, admin, getAdminUsers);
router.patch("/users/:id/role", protect, admin, updateUserRole);
router.get("/reviews", protect, admin, getAdminReviews);
router.delete("/reviews/:productId/:reviewId", protect, admin, deleteAdminReview);
router.get("/settings", protect, admin, getSiteSettings);
router.patch("/settings", protect, admin, updateSiteSettings);

module.exports = router;
