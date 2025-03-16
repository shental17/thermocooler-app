const cron = require("node-cron");
const Energy = require("../models/energyModel");
const { getPlugEnergyUsage } = require("./pythonUtils");

//Loads environment variables from a .env file into process.env
require("dotenv").config();

// Schedule a task to run at midnight every day
cron.schedule("59 23 * * *", async () => {
  console.log("Running cron job at midnight to store energy data...");

  try {
    // Fetch energy data for today (or gather it from the sensors)
    const energyData = await getPlugEnergyUsage(); // You need to define this function to get energy readings

    // Ensure thermocoolerId is available
    const thermocoolerId = process.env.THERMOCOOLER_ID;
    console.log(
      "Thermcooler Id in environment: " + process.env.THERMOCOOLER_ID
    );
    if (!thermocoolerId) {
      console.log(
        "Error: Thermocooler ID is not defined in the environment variables."
      );
      return;
    }

    if (energyData) {
      const existingRecord = await Energy.findOne({
        thermocoolerId: process.env.THERMOCOOLER_ID,
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
          $lt: new Date(new Date().setHours(23, 59, 59, 999)), // End of today
        },
      });

      if (existingRecord) {
        // If the record exists, update the energyConsumed field
        existingRecord.energyConsumed = energyData.today_energy;
        await existingRecord.save();
        console.log("Updated energy Data records!");
      } else {
        // Store the energy data for the day in the database
        const newEnergyRecord = new Energy({
          thermocoolerId: thermocoolerId,
          energyConsumed: energyData.today_energy,
          date: new Date(), // Store the current date
        });

        await newEnergyRecord.save();
        console.log("Energy data created successfully.");
      }
    } else {
      console.log("No energy data to store for today.");
    }
  } catch (error) {
    console.error("Error storing energy data at midnight:", error.message);
  }
});
