const express = require("express");

// Import the controller functions
const {
  getDailyEnergyUsage,
  getWeeklyEnergyUsage,
  getMonthlyEnergyUsage,
} = require("../controllers/energyController");

const router = express.Router();

// GET the daily energy usage
router.get("/:id/day", getDailyEnergyUsage);

// GET the weekly energy usage
router.get("/:id/week", getWeeklyEnergyUsage);

// GET the monthly energy usage
router.get("/:id/month", getMonthlyEnergyUsage);

module.exports = router;
