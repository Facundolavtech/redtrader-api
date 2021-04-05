const { Schema, model } = require("mongoose");

const VideoSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId },
    title: { type: String, required: true },
    src: { type: String, required: true },
    openToFreeUsers: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = model("Video", VideoSchema);
