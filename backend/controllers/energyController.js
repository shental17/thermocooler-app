const Energy = require("../models/energyModel");

// Helper function to calculate date ranges
const calculateDateRange = (rangeType) => {
  const today = new Date();
  let startDate, endDate;

  if (rangeType === "day") {
    startDate = new Date(today.setHours(0, 0, 0, 0)); // Start of today
    endDate = new Date(today.setHours(23, 59, 59, 999)); // End of today
  } else if (rangeType === "week") {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 6); // 7 days ago
    startDate = new Date(startOfWeek.setHours(0, 0, 0, 0)); // Start of 7 days ago
    endDate = new Date(today.setHours(23, 59, 59, 999)); // End of today
  } else if (rangeType === "month") {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of this month
    endDate = new Date(today); // End of today
  }

  return { startDate, endDate };
};

// GET daily energy usage
const getDailyEnergyUsage = async (req, res) => {
  try {
    const { id } = req.params; // Thermocooler ID
    const { startDate, endDate } = calculateDateRange("day");

    const energyData = await Energy.find({
      thermocoolerId: id,
      date: { $gte: startDate, $lte: endDate },
    });

    const totalEnergy = energyData.reduce(
      (sum, record) => sum + record.energyConsumed,
      0
    );

    res.status(200).json({ totalEnergy, energyData });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch daily energy usage." });
  }
};

// GET weekly energy usage
const getWeeklyEnergyUsage = async (req, res) => {
  try {
    const { id } = req.params; // Thermocooler ID
    const { startDate, endDate } = calculateDateRange("week");

    const energyData = await Energy.find({
      thermocoolerId: id,
      date: { $gte: startDate, $lte: endDate },
    });

    // Group by day and calculate daily totals
    const dailyEnergy = {};
    energyData.forEach((record) => {
      const day = record.date.toISOString().split("T")[0]; // Extract the date (YYYY-MM-DD)
      dailyEnergy[day] = (dailyEnergy[day] || 0) + record.energyConsumed;
    });

    res.status(200).json({ dailyEnergy });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weekly energy usage." });
  }
};

// GET monthly energy usage
const getMonthlyEnergyUsage = async (req, res) => {
  try {
    const { id } = req.params; // Thermocooler ID
    const { startDate, endDate } = calculateDateRange("month");

    const energyData = await Energy.find({
      thermocoolerId: id,
      date: { $gte: startDate, $lte: endDate },
    });

    const totalEnergy = energyData.reduce(
      (sum, record) => sum + record.energyConsumed,
      0
    );

    res.status(200).json({ totalEnergy, energyData });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch monthly energy usage." });
  }
};

module.exports = {
  getDailyEnergyUsage,
  getWeeklyEnergyUsage,
  getMonthlyEnergyUsage,
};
