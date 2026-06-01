const express = require("express");

const {
  addToCart,
  getCartItems,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} = require("../controllers/cartController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCartItems);
router.delete("/:id", protect, removeFromCart);
router.put(
  "/increase/:id",
  protect,
  increaseQuantity
);

router.put(
  "/decrease/:id",
  protect,
  decreaseQuantity
);

module.exports = router;