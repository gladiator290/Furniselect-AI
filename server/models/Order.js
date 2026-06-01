const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
        "Rejected",
      ],
      default: "Pending",
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      houseNo: String,
      area: String,
      city: String,
      state: String,
      pincode: String,
    },

    timeline: [
      {
        status: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],  
    cancelRequest: {
      type: Boolean,
      default: false,
    },

    returnRequest: {
      type: Boolean,
      default: false,
    },

    cancelReason: {
      type: String,
      default: "",
    },

    returnReason: {
      type: String,
      default: "",
    },

    adminCancelReason: {
      type: String,
      default: "",
    },

    refundStatus: {
      type: String,
      enum: [
        "Not Required",
        "Pending",
        "Processed",
      ],
      default: "Not Required",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);