const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  getAllUser,
  getAllThermocoolerData,
  updateWaterPumpVoltage,
  updateInternalFanVoltage,
} = require("../controllers/adminController");

const router = express.Router();

//require auth for all admin function
router.use(requireAuth);
// Roles - Admin

// GET all users
router.get("/", getAllUser);

// GET real time data
router.get("/:id/real-time-data", getAllThermocoolerData);

// SET water pump voltage
router.patch(
  "/:id/water-pump",
  //   (req, res) => {
  //   res.json({ message: "UPDATE water pump" });
  // }
  updateWaterPumpVoltage
);

// SET internal fan voltage
router.patch(
  "/:id/fan-voltage",
  //   (req, res) => {
  //   res.json({ message: "UPDATE internal fan voltage" });
  // }
  updateInternalFanVoltage
);

module.exports = router;
