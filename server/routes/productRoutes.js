const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getRelatedProducts,
} = require("../controllers/productController");

const router = express.Router();

router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createProduct
);

router.get("/", getProducts);

router.get("/:id/related", getRelatedProducts);

router.get("/:id", getSingleProduct);

router.put("/:id", protect, admin, updateProduct);

router.delete("/:id", protect, admin, deleteProduct);

router.post("/:id/review" , protect , addReview);



module.exports = router;