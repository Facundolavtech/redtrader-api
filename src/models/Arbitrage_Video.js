const { Schema, model } = require("mongoose");

const ArbitrajeVideoSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId },
    title: { type: String, required: true },
    src: { type: String, required: true },
    level: {
      type: String,
      required: true,
      enum: ["basic", "intermediate", "advanced"],
    },
    order: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("Arbitrage_Video", ArbitrajeVideoSchema);
