const { Schema, model } = require("mongoose");

const ConfirmAccountTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 1200,
    },
  },
  { versionKey: false }
);

module.exports = model("Confirm_Account_Token", ConfirmAccountTokenSchema);
