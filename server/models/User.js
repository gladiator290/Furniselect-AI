const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "salesman", "customer"],
      default: "customer",
    },

    addresses: {
  type: [
    {
      fullName: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },

      houseNo: {
        type: String,
        default: "",
      },

      area: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },

      isDefault: {
        type: Boolean,
        default: false,
      },
    },
  ],

  default: [],
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);