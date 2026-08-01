const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "store" },
    storeName: { type: String, default: "FurniSelect" },
    supportEmail: { type: String, default: "support@furniselect.com" },
    supportPhone: { type: String, default: "+91 7651971774" },
    announcement: { type: String, default: "Thoughtful furniture for modern living." },
    lowStockThreshold: { type: Number, default: 5, min: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
