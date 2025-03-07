const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomImages = {
  "Living Room": "../assets/living-room.png",
  "Main Bedroom": "../assets/main-bedroom.png",
  Bedroom: "../assets/bedroom.png",
  Office: "../assets/office.png",
  Study: "../assets/study.png",
};

const thermocoolerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: Object.keys(roomImages),
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
      default: 30,
    },
    fanSpeed: {
      type: Number,
      default: 0, // Fan speed in percentage (0-100)
    },
    esp32Address: { type: String, required: true },
    energyUsage: {
      type: Number,
      default: 0, // Energy usage (e.g., in kWh or other units)
    },
    waterPumpSpeed: {
      type: Number,
      default: 80, // Water Pump Speed in percentage (0-100)
    },
  },
  { timestamps: true }
);

// Virtual field for room image
thermocoolerSchema.virtual("roomImage").get(function () {
  return roomImages[this.name] || "https://example.com/default-room.jpg";
});

// Ensure virtual fields are included in JSON output
thermocoolerSchema.set("toJSON", { virtuals: true });
thermocoolerSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Thermocooler", thermocoolerSchema);
