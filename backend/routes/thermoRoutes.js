const express = require("express");
const Thermocooler = require("../models/thermocoolerModel");
const requireAuth = require("../middleware/requireAuth");
const {
  getAllThermocoolers,
  getThermocooler,
  addThermocooler,
  deleteThermocooler,
  updatePowerState,
  updateSetTemperature,
  updateFanSpeed,
} = require("../controllers/thermoController");

const router = express.Router();

router.use(requireAuth);

// (req, res) => {
//   res.json({ message: "UPDATE water pump" });
// }
// Roles - Users
// GET all thermocoolers for the authenticated user
router.get("/", getAllThermocoolers);

// GET a single thermocooler by ID
router.get("/:id", getThermocooler);

// POST a new thermocooler (add a new room)
router.post("/", addThermocooler);

// DELETE a thermocooler by ID
router.delete("/:id", deleteThermocooler);

// PATCH the power state of a specific thermocooler (ON/OFF)
router.patch("/:id/power", updatePowerState);

// PATCH the set temperature of a specific thermocooler
router.patch("/:id/set-temperature", updateSetTemperature);

// PATCH the fan speed of a specific thermocooler
router.patch("/:id/fan-speed", updateFanSpeed);

module.exports = router;
