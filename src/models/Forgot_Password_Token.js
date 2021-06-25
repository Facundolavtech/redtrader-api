const { Schema, model } = require("mongoose");

const ForgotPasswordTokenSchema = new Schema(
  {
    user: {
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

module.exports = model("Forgot_Password_Token", ForgotPasswordTokenSchema);
