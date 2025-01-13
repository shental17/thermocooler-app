const express = require("express");

const router = express.Router();

// Roles - Users

// GET the daily energy usage
router.get("/:id/day", (req, res) => {
  res.json({ message: "GET daily energy usage" });
});

// GET the weekly energy usage
router.get("/:id/week", (req, res) => {
  res.json({ message: "GET weekly energy usage" });
});

// GET the monthly energy usage
router.get("/:id/month", (req, res) => {
  res.json({ message: "GET monthly energy usage" });
});

module.exports = router;
