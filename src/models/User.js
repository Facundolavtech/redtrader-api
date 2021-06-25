const { Schema, model } = require("mongoose");
const short = require("shortid");

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    short_id: { type: String, unique: true },
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    roles: {
      type: [String],
      default: ["user"],
      enum: ["user", "admin", "educator", "partner"],
    },
    referred: {
      type: {
        partnerID: { type: Schema.Types.ObjectId, ref: "Partner" },
        partner_name: { type: String },
      },
      default: null,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },
    first_month_payed: { type: Boolean, default: false },
    coupon: { type: { discount: Number, name: String }, default: null },
    notifications_token: { type: Array },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.pre("save", async function (next) {
  let user = this;

  user.short_id = await short()
    .toUpperCase()
    .slice(0, 6)
    .replace(/[^a-zA-Z0-9]/g, `${Math.floor(Math.random() * 10) + 1}`);

  next();
});

module.exports = model("User", UserSchema);
