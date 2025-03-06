const mongoose = require("mongoose");
const User = require("../models/userModel");
const Thermocooler = require("../models/thermocoolerModel");
const Sensor = require("../models/sensorModel");
const Energy = require("../models/energyModel");
const { controlPlugPowerState } = require("../utils/pythonUtils");

// GET all thermocoolers for the authenticated user

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
    console.log(id);
    const thermocooler = await Thermocooler.findById(id);

    if (!thermocooler) {
      return res.status(404).json({ error: "Thermocooler not found." });
    }
    const io = req.app.get("io");
    console.log("Io Get");

    io.emit("getThermocooler", {
      powerstate: thermocooler.powerstate,
      setTemperature: thermocooler.setTemperature,
      fanSpeed: thermocooler.fanSpeed,
    });
    console.log(`ESP32 Command: Get Thermocooler Readings`);

    // Fetch real-time data from Arduino (mocking this for now)
    const arduinoData = {
      currentTemperature: 22.5, // Replace with Arduino real-time data
      powerUsage: 50, // Replace with Arduino real-time data
    };

    res.status(200).json({
      name: thermocooler.name,
      powerstate: thermocooler.powerstate,
      setTemperature: thermocooler.setTemperature,
      fanSpeed: thermocooler.fanSpeed,
      currentTemperature: arduinoData.currentTemperature,
      powerUsage: arduinoData.powerUsage,
    });
  } catch (error) {
    // Handle errors gracefully
    res.status(500).json({ error: "Failed to fetch single thermocooler." });
  }
};

const createSensors = async (thermocoolerId) => {
  const sensorNames = ["Sensor 1", "Sensor 2", "Sensor 3", "Sensor 4"];
  const sensorValues = [0, 0, 0, 0]; // Default sensor values

  const sensors = await Promise.all(
    sensorNames.map((name, index) =>
      new Sensor({
        name, // Pass the name for each sensor
        sensorType: "temperature",
        value: sensorValues[index], // Use the corresponding value
        thermocoolerId,
      }).save()
    )
  );
  return sensors;
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
    const { name, arduinoAddress } = req.body;

    // Check if required fields are provided
    if (!name || !arduinoAddress) {
      return res
        .status(400)
        .json({ error: "Name and Arduino address are required." });
    }

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    const userId = req.user._id; // Get the user ID from the authenticated user

    // Create a new thermocooler instance
    const newThermocooler = new Thermocooler({
      name,
      setTemperature: 25, // Default value
      fanSpeed: 0, // Default value
      arduinoAddress,
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

    // Create sensors for the thermocooler
    const sensors = await createSensors(savedThermocooler._id);

    // Add the sensors to the thermocooler
    savedThermocooler.sensors = sensors.map((sensor) => sensor._id);
    await savedThermocooler.save();

    // Create an initial energy record for the thermocooler
    const initialEnergyRecord = await createEnergyRecord(savedThermocooler._id);

    // Return the response with the newly created thermocooler, sensors, and energy record
    res.status(201).json({
      message: "Thermocooler, Sensors, and Energy Record created successfully",
      thermocooler: savedThermocooler,
      sensors,
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

    // Delete the sensors associated with this thermocooler
    const sensorDeletionResult = await Sensor.deleteMany({
      thermocoolerId: thermocooler._id,
    });

    // Check if sensors were successfully deleted
    if (sensorDeletionResult.deletedCount === 0) {
      console.log("No sensors found for this thermocooler.");
    } else {
      console.log(`${sensorDeletionResult.deletedCount} sensors deleted.`);
    }

    // Delete the thermocooler
    await Thermocooler.deleteOne({ _id: thermocooler._id });

    // Return success message if deleted
    res.status(200).json({
      message: "Thermocooler and associated sensors deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting thermocooler:", error);
    res.status(500).json({ error: "Failed to delete thermocooler." });
  }
};

const updatePowerState = async (req, res) => {
  try {
    const { id } = req.params; // Thermocooler ID from route parameters
    const { powerState } = req.body; // New power state from the request body

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

    // Check if thermocooler exists and update the power state in the database
    const thermocooler = await Thermocooler.findByIdAndUpdate(
      id,
      { powerState },
      { new: true }
    );

    if (!thermocooler) {
      return res.status(404).json({ error: "Thermocooler not found." });
    }
    console.log("Found MongoThermocooler");
    const io = req.app.get("io");
    console.log("Io Get");

    io.emit("updatePowerState", { powerState: powerState });
    console.log(
      `ESP32 Command: Turn thermocooler ${powerState ? "ON" : "OFF"}`
    );

    //Smart Plug Control
    console.log("Running control Power Plug Python Script...");
    controlPlugPowerState(powerState)
      .then(() => {
        console.log("Power State Changed!");
      })
      .catch((error) => {
        console.error("Failed to change power state", error);
      });
    console.log("Python script Done.");

    res.status(200).json({
      message: `Thermocooler power state updated to ${
        powerState ? "ON" : "OFF"
      }.`,
      thermocooler,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update power state." });
  }
};

const updateSetTemperature = async (req, res) => {
  try {
    const { id } = req.params; // Thermocooler ID from the route parameters
    const { setTemperature } = req.body; // Desired temperature from the request body

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

    // Send command to Arduino
    try {
      // Replace this with actual Arduino communication logic
      console.log(`Arduino Command: Set temperature to ${setTemperature}°C`);
      // Example: await sendCommandToArduino(id, setTemperature);
    } catch (arduinoError) {
      // Log the Arduino error
      console.error("Arduino communication failed:", arduinoError.message);

      // Return an error response but do not rollback database changes
      return res
        .status(500)
        .json({ error: "Failed to communicate with Arduino." });
    }

    res.status(200).json({
      message: `Thermocooler temperature set to ${setTemperature}°C successfully.`,
      thermocooler,
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

    const thermocooler = await Thermocooler.findByIdAndUpdate(
      id,
      { fanSpeed },
      { new: true }
    );

    if (!thermocooler) {
      return res.status(404).json({ error: "Thermocooler not found." });
    }
    const io = req.app.get("io");
    console.log("Io Get");

    io.emit("updateFanSpeed", { fanSpeed: fanSpeed });
    console.log(`ESP32 Command: Update fan speed updated to ${fanSpeed}%.`);

    res.status(200).json({
      message: `Fan speed updated to ${fanSpeed}% successfully.`,
      thermocooler,
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
  updatePowerState,
  updateSetTemperature,
  updateFanSpeed,
};
