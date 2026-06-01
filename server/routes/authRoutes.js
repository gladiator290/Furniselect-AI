const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getMe,
  addAddress,
  editAddress,
  deleteAddress,
} = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.get(
  "/me",
  protect,
  getMe
);

/* Address Routes */

router.post(
  "/address",
  protect,
  addAddress
);

router.put(
  "/address/:index",
  protect,
  editAddress
);

router.delete(
  "/address/:index",
  protect,
  deleteAddress
);

module.exports = router;