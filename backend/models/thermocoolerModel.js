const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const thermocoolerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    powerState: {
      type: Boolean,
      default: false, // false = OFF, true = ON
    },
    setTemperature: {
      type: Number,
      required: true,
    },
    currentTemperature: {
      type: Number,
      default: 0, // This can be updated in real time via WebSocket or polling
    },
    fanSpeed: {
      type: Number,
      default: 0, // Fan speed (e.g., in RPM)
    },
    arduinoAddress: { type: String, required: true },
    energyUsage: {
      type: Number,
      default: 0, // Energy usage (e.g., in kWh or other units)
    },
    waterPumpVoltage: {
      type: Number,
      default: 0, // Water pump voltage (can be adjusted)
    },
    internalFanVoltage: {
      type: Number,
      default: 0, // Internal fan voltage (can be adjusted)
    },
    sensors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sensor",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Thermocooler", thermocoolerSchema);
