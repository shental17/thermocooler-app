const mongoose = require("mongoose");
const User = require("../models/userModel");
const Thermocooler = require("../models/thermocoolerModel");
const Energy = require("../models/energyModel");
const {
  controlPlugPowerState,
  getPlugEnergyUsage,
} = require("../utils/pythonUtils");

// GET all thermocoolers for the authenticated user
function isValidMacAddress(macAddress) {
  const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
  return macRegex.test(macAddress);
}

async function fetchPowerUsage() {
  try {
    const data = await getPlugEnergyUsage();
    return data.current_power / 1000; // Convert to kW
  } catch (error) {
    console.error("Error fetching power usage:", error);
    return 0; // Return 0 in case of an error
  }
}

const getAllThermocoolers = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    const userId = req.user._id;
    console.log("User ID:", userId);
    const thermocoolers = await Thermocooler.find({ userId });

    if (!thermocoolers || thermocoolers.length === 0) {
      return res
        .status(404)
        .json({ error: "No thermocoolers found for this user" });
    }

    res.status(200).json(thermocoolers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch thermocoolers" });
  }
};

// GET single thermocooler for authenticated user
const getThermocooler = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching Thermocooler ID:", id);

    let powerUsage = 0;
    let latestSensorData = {};

    const thermocooler = await Thermocooler.findById(id);
    if (!thermocooler) {
      return res.status(404).json({ error: "Thermocooler not found." });
    }

    const io = req.app.get("io");
    const esp32Address = thermocooler.esp32Address;
    console.log("ESP32 Address from DB:", esp32Address);

    // Prepare base response data
    const responseData = {
      name: thermocooler.name,
      roomImage: thermocooler.roomImage,
      powerState: thermocooler.powerState,
      setTemperature: thermocooler.setTemperature,
      fanSpeed: thermocooler.fanSpeed,
      powerUsage: 0, // Default
      currentTemperature: null,
    };

    // Check if the device is online
    if (!io.deviceRegistry || !io.deviceRegistry[esp32Address]) {
      responseData.error =
        "The thermocooler is currently not online. Please check your connection.";
      return res.status(200).json(responseData);
    }

    // Device is online, get its client ID
    const targetClientId = io.deviceRegistry[esp32Address];
    console.log("Target Client ID:", targetClientId);

    // Emit event to request real-time sensor data
    console.log("Requesting data from ESP32...");
    io.to(targetClientId).emit("getThermocooler", {
      powerState: thermocooler.powerState,
      setTemperature: thermocooler.setTemperature,
      fanSpeed: thermocooler.fanSpeed,
    });

    // Wait for ESP32 response (max 5 seconds)
    latestSensorData = await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn("ESP32 response timeout. Using last known data.");
        resolve(io.sensorData?.[esp32Address] || {});
      }, 5000); // 5 seconds timeout

      io.once(`thermocoolerData:${esp32Address}`, (data) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });

    console.log("Received sensor data:", latestSensorData);

    // Fetch power usage
    try {
      powerUsage = await fetchPowerUsage();
    } catch (error) {
      console.error("Error getting energy usage:", error);
    }

    // Add real-time data to response
    responseData.powerUsage = powerUsage;
    responseData.currentTemperature = latestSensorData.humiditySensor2 || null;

    console.log("Final Response Data:", responseData);
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching thermocooler data:", error);
    res.status(500).json({ error: "Failed to fetch single thermocooler." });
  }
};

const createEnergyRecord = async (thermocoolerId) => {
  const initialEnergyRecord = new Energy({
    thermocoolerId,
    energyConsumed: 0, // Initial energy consumption is 0
    date: new Date(),
  });
  return await initialEnergyRecord.save();
};

const addThermocooler = async (req, res) => {
  try {
    const { name, esp32Address } = req.body;

    // Check if required fields are provided
    if (!name || !esp32Address) {
      return res
        .status(400)
        .json({ error: "Name and esp32 address are required." });
    }

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    if (!isValidMacAddress(esp32Address)) {
      return res.status(404).json({ error: "ESP32 Mac Address is not valid." });
    }

    const userId = req.user._id; // Get the user ID from the authenticated user

    // Create a new thermocooler instance
    const newThermocooler = new Thermocooler({
      name,
      setTemperature: 25, // Default value
      fanSpeed: 0, // Default value
      esp32Address,
      userId,
    });

    const savedThermocooler = await newThermocooler.save();

    // Add the new thermocooler ID to the user's thermocoolers array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.thermocoolers.push(savedThermocooler._id);
    await user.save();

    // Create an initial energy record for the thermocooler
    const initialEnergyRecord = await createEnergyRecord(savedThermocooler._id);

    // Return the response with the newly created thermocooler, and energy record
    res.status(201).json({
      message: "Thermocooler and Energy Record created successfully",
      thermocooler: savedThermocooler,
      initialEnergyRecord,
    });
  } catch (error) {
    console.error("Error adding thermocooler:", error);
    res.status(500).json({ error: "Failed to add thermocooler." });
  }
};

// Delete a thermocooler by ID
const deleteThermocooler = async (req, res) => {
  try {
    const { id } = req.params; // Get the thermocooler ID from the request parameters
    const userId = req.user._id; // Get the user ID from the authenticated user

    // Find the thermocooler and make sure it's associated with the user
    const thermocooler = await Thermocooler.findOne({
      _id: id,
      userId: userId,
    });

    if (!thermocooler) {
      return res.status(404).json({
        error:
          "Thermocooler not found or you don't have permission to delete it.",
      });
    }

    // Delete the thermocooler
    await Thermocooler.deleteOne({ _id: thermocooler._id });

    // Remove the thermocooler ID from the associated user's thermocoolers array
    await User.findByIdAndUpdate(userId, {
      $pull: { thermocoolers: id },
    });

    // Return success message if deleted
    res.status(200).json({
      message: "Thermocooler deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting thermocooler:", error);
    res.status(500).json({ error: "Failed to delete thermocooler." });
  }
};

// GET current temperature of single thermocooler for authenticated user
const getCurrentTemperature = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching Thermocooler ID:", id);

    const thermocooler = await Thermocooler.findById(id);
    if (!thermocooler) {
      return res.status(404).json({ error: "Thermocooler not found." });
    }

    const io = req.app.get("io");
    if (!io) {
      return res.status(500).json({ error: "Socket.IO not initialized." });
    }

    const esp32Address = thermocooler.esp32Address;
    console.log("ESP32 Address from DB:", esp32Address);

    // Wait for ESP32 response (max 5 seconds)
    const latestSensorData = await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn("ESP32 response timeout. Using last known data.");
        resolve(io.sensorData?.[esp32Address] || {}); // Fixed possible crash
      }, 5000); // 5 seconds timeout

      io.once(`thermocoolerData:${esp32Address}`, (data) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });

    // Use correct sensor key
    const currentTemperature = latestSensorData.humiditySensor2 || null;

    return res.status(200).json({ currentTemperature });
  } catch (error) {
    console.error("Error fetching thermocooler current temperature:", error);
    res.status(500).json({
      error: "Failed to fetch current temperature of single thermocooler.",
    });
  }
};

const updatePowerState = async (req, res) => {
  try {
    const { id } = req.params; // Thermocooler ID from route parameters
    const { powerState } = req.body; // New power state from the request body

    let powerUsage;

    // Validate thermocooler ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid thermocooler ID" });
    }

    // Validate powerState
    if (typeof powerState !== "boolean") {
      return res.status(400).json({
        error: "Invalid powerState. Must be a boolean (true or false).",
      });
    }

    // Check if thermocooler exists
    const thermocooler = await Thermocooler.findById(id);
    if (!thermocooler) {
      return res.status(404).json({ error: "Thermocooler not found." });
    }

    const io = req.app.get("io");
    const esp32Address = thermocooler.esp32Address;
    const targetClientId = io.deviceRegistry[esp32Address];

    // Check if the ESP32 device is connected
    if (!targetClientId) {
      return res.status(400).json({
        error: `Thermocooler is not connected. Please ensure the device is connected before updating power state.`,
      });
    }

    // Update power state in the database
    thermocooler.powerState = powerState;
    await thermocooler.save();

    // // Emit power state change to ESP32
    // io.to(targetClientId).emit("updatePowerState", { powerState });
    console.log(
      `ESP32 Command: Turn thermocooler ${powerState ? "ON" : "OFF"}`
    );

    console.log(
      "Thermcoooler PowerState before controlPlugPowerState is: " + powerState
    );

    try {
      await controlPlugPowerState(powerState);
      console.log("Power state successfully updated.");
    } catch (error) {
      console.error("Error controlling plug power state:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000)); // 500ms delay

    try {
      powerUsage = await fetchPowerUsage();
      console.log(
        `Power Usage after ${powerState ? "ON" : "OFF"}: ${powerUsage}W`
      );
    } catch (error) {
      console.error("Error getting energy usage:", error);
      powerUsage = 0;
    }

    res.status(200).json({
      message: `Thermocooler power state updated to ${
        powerState ? "ON" : "OFF"
      }.`,
      thermocooler,
      powerUsage,
    });
  } catch (error) {
    console.error("Error updating power state:", error);
    res.status(500).json({ error: "Failed to update power state." });
  }
};

const updateSetTemperature = async (req, res) => {
  try {
    const { id } = req.params; // Thermocooler ID from the route parameters
    const { setTemperature } = req.body; // Desired temperature from the request body

    let powerUsage;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid thermocooler ID." });
    }

    if (
      typeof setTemperature !== "number" ||
      setTemperature < 18 ||
      setTemperature > 25
    ) {
      return res.status(400).json({
        error: "Invalid setTemperature. Must be a number between 18 and 25°C.",
      });
    }

    const thermocooler = await Thermocooler.findByIdAndUpdate(
      id,
      { setTemperature },
      { new: true }
    );

    if (!thermocooler) {
      return res.status(404).json({ error: "Thermocooler not found." });
    }

    await new Promise((resolve) => setTimeout(resolve, 5000)); // 500ms delay

    try {
      powerUsage = await fetchPowerUsage();
      console.log(
        `Power Usage after updating thermocooler temperature set to ${setTemperature}°C: ${powerUsage}W`
      );
    } catch (error) {
      console.error("Error getting energy usage:", error);
      powerUsage = 0;
    }

    res.status(200).json({
      message: `Thermocooler temperature set to ${setTemperature}°C successfully.`,
      thermocooler,
      powerUsage: powerUsage,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update set temperature." });
  }
};

const updateFanSpeed = async (req, res) => {
  try {
    const { id } = req.params; // Thermocooler ID from route parameters
    const { fanSpeed } = req.body; // Desired fan speed from request body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid thermocooler ID." });
    }

    if (typeof fanSpeed !== "number" || fanSpeed < 0 || fanSpeed > 100) {
      return res.status(400).json({
        error: "Invalid fanSpeed. Must be a number between 0 and 100.",
      });
    }

    const thermocooler = await Thermocooler.findById(id);

    if (!thermocooler) {
      return res.status(404).json({ error: "Thermocooler not found." });
    }

    const io = req.app.get("io");
    console.log("Io Get");
    const esp32Address = thermocooler.esp32Address;
    const targetClientId = io.deviceRegistry[esp32Address];

    if (!targetClientId) {
      return res.status(400).json({
        error: `Thermocooler is not connected. Please ensure the device is connected before updating fan speed.`,
      });
    }

    // Update power state in the database
    thermocooler.fanSpeed = fanSpeed;
    await thermocooler.save();

    io.to(targetClientId).emit("updateFanSpeed", { fanSpeed: fanSpeed });
    console.log(`ESP32 Command: Update fan speed updated to ${fanSpeed}%.`);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 500ms delay

    try {
      powerUsage = await fetchPowerUsage();
      console.log(
        `Power Usage after updating fan speed to ${fanSpeed}%: ${powerUsage}W`
      );
    } catch (error) {
      console.error("Error getting energy usage:", error);
      powerUsage = 0;
    }

    res.status(200).json({
      message: `Fan speed updated to ${fanSpeed}% successfully.`,
      thermocooler,
      powerUsage: powerUsage,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update fan speed." });
  }
};

module.exports = {
  getAllThermocoolers,
  getThermocooler,
  addThermocooler,
  deleteThermocooler,
  getCurrentTemperature,
  updatePowerState,
  updateSetTemperature,
  updateFanSpeed,
};
