const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    short_id: { type: String, unique: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    roles: {
      type: {
        educator: { type: Boolean, default: false },
        admin: { type: Boolean, default: false },
        user: { type: Boolean, default: true },
      },
      default: {
        educator: false,
        admin: false,
        user: true,
      },
    },
    plan: {
      type: {
        active: { type: Boolean, default: false },
        plan_type: {
          type: {
            premium: { type: Boolean, default: false },
            premium_plus: { type: Boolean, default: false },
          },
        },
        expire: {
          type: Date,
          default: null,
        },
        txn_id: {
          type: String,
          default: null,
        },
      },
      default: {
        active: false,
        plan_type: {
          premium: false,
          premium_plus: false,
        },
        expire: null,
        txn_id: null,
      },
    },
    first_month_payed: { type: Boolean, default: false },
    educator_info: {
      type: {
        stream_key: { type: String },
        educator_thumb: { type: String },
        educator_socials: {
          type: {
            instagram: { type: String },
            facebook: { type: String },
          },
        },
      },
      default: null,
    },
    discount: {
      type: {
        active: { type: Boolean, default: false },
        percent: { type: Number, default: 0 },
        coupon_name: { type: String, default: null },
      },
      default: {
        active: false,
        percent: 0,
        coupon_name: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
