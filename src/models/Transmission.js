const { Schema, model } = require("mongoose");

const TransmissionSchema = new Schema(
  {
    educator: { type: String },
    data: {
      type: {
        transmission_number: { type: Number, required: true, unique: true },
        description: { type: String, required: true },
        src: { type: String, required: true },
      },
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("Transmission", TransmissionSchema);
