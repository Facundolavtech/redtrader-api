const { Schema, model } = require("mongoose");

const CouponSchema = new Schema(
  {
    name: String,
    discount: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Coupon", CouponSchema);
