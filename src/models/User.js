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
        educator: { type: Boolean },
        admin: { type: Boolean },
        user: { type: Boolean },
        partner: { type: Boolean },
      },
      default: {
        educator: false,
        admin: false,
        partner: false,
        user: true,
      },
    },
    partnerID: { type: String, default: null },
    partner_stats: {
      type: {
        registers: { type: Number },
        pays: { type: Number },
      },
      default: null,
    },
    referred: {
      type: {
        partnerID: { type: String, default: null },
        partner_name: { type: String, default: null },
      },
      default: null,
    },
    plan: {
      type: {
        active: { type: Boolean },
        plan_type: {
          type: {
            premium: { type: Boolean },
            premium_plus: { type: Boolean },
          },
        },
        expire: {
          type: Date,
        },
        txn_id: {
          type: String,
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
        schedules: { type: Array },
      },
      default: {
        stream_key: null,
        educator_thumb: null,
      },
    },
    stream_pw: { type: String },
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
    notifications_token: { type: Array },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("User", UserSchema);
