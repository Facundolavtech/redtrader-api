const { Schema, model } = require("mongoose");
const shortid = require("shortid");
const setExpireDate = require("../utils/setExpireDate");

const PartnerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    name: { type: String, ref: "User" },
    email: { type: String, ref: "User", unique: true },
    stats: { type: { registers: Number, pays: Number } },
    special_discount: { type: Number, default: 0 },
    next_reset: { type: Date },
    link: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PartnerSchema.pre("save", async function (next) {
  let user = this;

  user.stats = { registers: 0, pays: 0 };
  user.link = await shortid.generate();
  user.next_reset = setExpireDate(1);

  next();
});

module.exports = model("Partner", PartnerSchema);
