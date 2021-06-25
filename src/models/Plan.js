const { Schema, model } = require("mongoose");

const PlanSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["premium", "premium_plus"] },
    expires: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("Plan", PlanSchema);
