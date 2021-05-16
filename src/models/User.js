const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    short_id: { type: String, unique: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    plan: { type: Boolean, required: true, default: false },
    isSuperAdmin: { type: Boolean, default: false },
    first_month: { type: Boolean, default: false },
    role_educator: { type: Boolean, default: false },
    stream_key: { type: String },
    discount: {
      type: {
        active: { type: Boolean },
        percent: { type: Number },
        coupon_name: { type: String },
      },
      default: {
        active: false,
        percent: 0,
        coupon_name: null,
      },
    },
    plan_details: {
      expire: {
        type: Date,
      },
      txn_id: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
