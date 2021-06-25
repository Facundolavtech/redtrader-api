const { Schema, model } = require("mongoose");

const ConfirmAccountTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
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
