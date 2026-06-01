const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    tags: [String],

    image: {
      type: String,
    },

    material: {
      type: String,
    },

    color: {
      type: String,
    },

    dimensions: {
      type: String,
    },

    stock: {
      type: Number,
      default: 1,
    },
    reviews: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
    },

    rating: {
      type: Number,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],

numReviews: {
  type: Number,
  default: 0,
},

averageRating: {
  type: Number,
  default: 0,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema); 