const { Schema, model } = require("mongoose");

const date = new Date();

const SignalSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId },
    instrument: { type: String, required: true },
    operation_type: { type: { label: String, value: String }, required: true },
    market: { type: { label: String, value: String }, required: true },
    execution_type: { type: { label: String, value: String }, required: true },
    entry_point: { type: String, required: true },
    stop_loss: { type: String, required: true },
    take_profit: { type: String, required: true },
    expireAt: {
      type: Date,
      default: date.setDate(date.getDate() + 1),
      index: { expires: 86400 },
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("Signal", SignalSchema);
