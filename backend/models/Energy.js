const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const energySchema = new Schema({
  thermocoolerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thermocooler",
    required: true,
  },
  energyConsumed: {
    type: Number, // e.g., in kWh
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Energy", energySchema);
