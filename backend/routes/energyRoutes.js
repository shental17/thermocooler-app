const express = require("express");
const requireAuth = require("../middleware/requireAuth");

// Import the controller functions
const {
  getElectricityTariff,
  updateElectricityTariff,
  getEnergyUsage,
} = require("../controllers/energyController");

const router = express.Router();

//require auth for all profile function
router.use(requireAuth);

// GET the electricity Tariff
router.get("/", getElectricityTariff);

// UPDATE the electricity Tariff
router.patch("/", updateElectricityTariff);

// GET overall energy usage
router.get("/usage", getEnergyUsage);

module.exports = router;
