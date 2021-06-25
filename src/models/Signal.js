const { Schema, model } = require("mongoose");

const SignalSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId },
    data: {
      type: {
        instrument: { type: String, required: true },
        operation_type: {
          type: { label: String, value: String },
          required: true,
        },
        market: { type: { label: String, value: String }, required: true },
        execution_type: {
          type: { label: String, value: String },
          required: true,
        },
        entry_point: { type: String, required: true },
        stop_loss: { type: String, required: true },
        take_profit: { type: String, required: true },
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 86400,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("Signal", SignalSchema);
