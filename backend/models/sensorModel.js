const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sensorSchema = new Schema(
  {
    sensorType: {
      type: String,
      required: true, // Example: "temperature", "humidity"
    },
    value: {
      type: Number,
      required: true,
    },
    thermocoolerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thermocooler",
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sensor", sensorSchema);
