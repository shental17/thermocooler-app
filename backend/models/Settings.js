const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const settingsSchema = new Schema(
  {
    thermocoolerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thermocooler",
      required: true,
    },
    powerState: {
      type: Boolean,
      default: false, // false = OFF, true = ON
    },
    waterPumpVoltage: {
      type: Number,
      default: 0, // Example: default voltage for water pump
    },
    internalFanVoltage: {
      type: Number,
      default: 0, // Example: default voltage for internal fan
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
