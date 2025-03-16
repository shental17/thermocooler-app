const mongoose = require("mongoose");
const User = require("../models/userModel");
const Energy = require("../models/energyModel");
const { getPlugEnergyUsage } = require("../utils/pythonUtils");

//Loads environment variables from a .env file into process.env
require("dotenv").config();

async function fetchTodayEnergyUsage(userId) {
  console.log("FetchTodayEnergyUsage userId: " + userId);
  console.log("FetchTodayEnergyUsag env USER_ID: " + process.env.USER_ID);
  // Compare the userId with the environment variable correctly using ===
  if (userId == process.env.USER_ID) {
    console.log("FetchTodayEnergyUsage: User ID matches");
    try {
      const data = await getPlugEnergyUsage();
      console.log("FetchTodayEnergyUsage: Got energy usage from smart plug");
      return data.today_energy; // Return today's energy usage
    } catch (error) {
      console.error("Error fetching energy usage:", error);
      return 0; // Return 0 if there's an error
    }
  }
  console.log("UserId do not match");
  return 0; // Return 0 if the userId does not match
}

const getElectricityTariff = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      console.log("user: " + req.user);
      console.log("user id: " + req.user._id);
      return res.status(401).json({ error: "User not authenticated." });
    }

    const userId = req.user._id;

    // Retrieve only the electricityTariff field
    const user = await User.findById(userId).select("electricityTariff");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      electricityTariff: user.electricityTariff, // Correctly returns the value
    });
  } catch (error) {
    console.error("Error getting electricity tariff:", error.message);
    res.status(500).json({ error: "Failed to retrieve electricity tariff." });
  }
};

const updateElectricityTariff = async (req, res) => {
  try {
    const { electricityTariff } = req.body;

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    // Validate electricityTariff (ensure it's a positive number)
    if (typeof electricityTariff !== "number" || electricityTariff < 0) {
      return res
        .status(400)
        .json({ error: "Invalid electricity tariff value." });
    }

    const userId = req.user._id;

    // Update the electricityTariff
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { electricityTariff },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "Electricity tariff updated successfully.",
      electricityTariff: updatedUser.electricityTariff, // Optional: return the new value
    });
  } catch (error) {
    console.error("Error updating electricity tariff:", error.message);
    res.status(500).json({ error: "Failed to update electricity tariff." });
  }
};

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

const getEnergyUsage = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    const userId = req.user._id;
    const user = await User.findById(userId).populate("thermocoolers");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const thermocoolerIds = user.thermocoolers.map((tc) => tc._id);

    const todayEnergy = await fetchTodayEnergyUsage(userId);
    console.log("getDailyEnergyUsage: Run finish fetchTodayEnergyUsage");

    if (todayEnergy > 0) {
      // Try to find an existing energy record for today
      console.log("getDailyEnergyUsage: Finding existing records");
      const existingRecord = await Energy.findOne({
        thermocoolerId: process.env.THERMOCOOLER_ID,
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
          $lt: new Date(new Date().setHours(23, 59, 59, 999)), // End of today
        },
      });

      if (existingRecord) {
        console.log("getDailyEnergyUsage: FOUND existing records");
        // If the record exists, update the energyConsumed field
        existingRecord.energyConsumed = todayEnergy;
        await existingRecord.save();
      } else {
        console.log("getDailyEnergyUsage: DID NOT FIND existing records");
        // If the record doesn't exist, create a new one
        const newEnergyRecord = new Energy({
          thermocoolerId: process.env.THERMOCOOLER_ID,
          energyConsumed: todayEnergy,
          date: new Date(), // Store the current date
        });

        await newEnergyRecord.save();
      }
    }

    // Calculate date ranges for daily, weekly, and monthly data
    const { startDate: dailyStart, endDate: dailyEnd } =
      calculateDateRange("day");
    const { startDate: weeklyStart, endDate: weeklyEnd } =
      calculateDateRange("week");
    const { startDate: monthlyStart, endDate: monthlyEnd } =
      calculateDateRange("month");

    // Fetch energy data for each time range
    const [dailyData, weeklyData, monthlyData] = await Promise.all([
      Energy.find({
        thermocoolerId: { $in: thermocoolerIds },
        date: { $gte: dailyStart, $lte: dailyEnd },
      }),
      Energy.find({
        thermocoolerId: { $in: thermocoolerIds },
        date: { $gte: weeklyStart, $lte: weeklyEnd },
      }),
      Energy.find({
        thermocoolerId: { $in: thermocoolerIds },
        date: { $gte: monthlyStart, $lte: monthlyEnd },
      }),
    ]);

    // Compute total energy usage
    const totalDailyEnergy = dailyData.reduce(
      (sum, record) => sum + record.energyConsumed,
      0
    );
    const totalWeeklyEnergy = weeklyData.reduce(
      (sum, record) => sum + record.energyConsumed,
      0
    );
    const totalMonthlyEnergy = monthlyData.reduce(
      (sum, record) => sum + record.energyConsumed,
      0
    );

    // Group weekly data by day
    const dailyEnergyBreakdown = {};
    weeklyData.forEach((record) => {
      const day = record.date.toISOString().split("T")[0];
      dailyEnergyBreakdown[day] =
        (dailyEnergyBreakdown[day] || 0) + record.energyConsumed;
    });

    res.status(200).json({
      dailyEnergy: totalDailyEnergy,
      weeklyEnergy: dailyEnergyBreakdown,
      monthlyEnergy: totalMonthlyEnergy,
    });
  } catch (error) {
    console.error("Error fetching energy usage:", error);
    res.status(500).json({ error: "Failed to fetch energy usage data." });
  }
};

module.exports = {
  getElectricityTariff,
  updateElectricityTariff,
  getEnergyUsage,
};
