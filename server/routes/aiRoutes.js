const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const {
  analyzeRoom,
} = require("../controllers/aiController");

const router = express.Router();

router.post(
  "/analyze-room",
  upload.single("image"),
  analyzeRoom
);

module.exports = router;