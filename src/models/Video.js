const { Schema, model } = require("mongoose");

const VideoSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId },
    title: { type: String, required: true },
    src: { type: String, required: true },
    unlocked: { type: Boolean, required: true, default: false },
    order: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("Video", VideoSchema);
