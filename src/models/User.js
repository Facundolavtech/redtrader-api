const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plan: { type: Boolean, required: true, default: false },
    isSuperAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema);
