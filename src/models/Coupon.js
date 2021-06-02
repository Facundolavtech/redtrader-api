const { Schema, model } = require("mongoose");

const CouponSchema = new Schema(
  {
    coupon_name: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Coupon", CouponSchema);
