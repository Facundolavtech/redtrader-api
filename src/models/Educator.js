const { Schema, model } = require("mongoose");
const shortid = require("shortid");

const EducatorSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    name: { type: String, ref: "User" },
    stream_pw: String,
    stream_key: String,
    short_id: { type: String, ref: "User", unique: true },
    thumbnail: { type: String, default: "" },
    schedules: { type: Array },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

EducatorSchema.pre("save", async function (next) {
  let user = this;

  user.stream_pw = await shortid.generate();
  user.stream_key = await shortid.generate();

  next();
});

module.exports = model("Educator", EducatorSchema);
