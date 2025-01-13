const express = require("express");

const router = express.Router();

// Roles - Users

// GET the power state of the thermocooler (ON/OFF)
router.get("/:id/power", (req, res) => {
  res.json({ message: "GET power state" });
});

// PATCH the power state of the thermocooler (ON/OFF)
router.patch("/:id/power", (req, res) => {
  res.json({ message: "UPDATE power state" });
});

// GET the set temperature of the thermocooler
router.get("/:id/set-temperature", (req, res) => {
  res.json({ message: "GET set temperature" });
});

// PATCH the set temperature of the thermocooler
router.patch("/:id/set-temperature", (req, res) => {
  res.json({ message: "UPDATE set temperature" });
});

// GET the current temperature of the thermocooler (Read-only) (Real Time)
router.get("/:id/current-temperature", (req, res) => {
  res.json({ message: "GET current temperature" });
});

// GET the energy usage of the thermocooler (Read-only) (Real Time)
router.get("/:id/energy", (req, res) => {
  res.json({ message: "GET energy usage" });
});

// GET the fan speed of the thermocooler
router.get("/:id/fan-speed", (req, res) => {
  res.json({ message: "GET fan speed" });
});

// PATCH the fan speed of the thermocooler
router.patch("/:id/fan-speed", (req, res) => {
  res.json({ message: "UPDATE fan speed" });
});

module.exports = router;
