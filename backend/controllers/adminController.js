const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const chroma = require("chroma-js");
const User = require("../models/userModel");
const Thermocooler = require("../models/thermocoolerModel");
const Sensor = require("../models/sensorModel");
const Energy = require("../models/energyModel");

//Helper Function to calculate average temperature
const average = (arr) => {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

//Helper Function to find the rounded up time based on 5 mins
const roundUpToNext5Min = (time) => {
  const minutes = time.minute;
  const remainder = minutes % 5;
  return time.plus({ minutes: 5 - remainder }).startOf("minute");
};

//GET Temperature Data for Single Thermocooler
const getTemperatureData = async (req, res) => {
  const { id } = req.params;

  const now = DateTime.local(); // Current time
  const roundedNow = roundUpToNext5Min(now); // Round up to the next 5-minute interval
  const startTime = roundedNow.minus({ minutes: 30 }); // Start time: 30 minutes ago
  const endTime = roundedNow; // End time is the rounded current time
  const timeLabels = [];

  // Generate 5-minute intervals for the last 30 minutes until now
  for (let i = 0; i <= endTime.diff(startTime, "minutes").minutes; i += 5) {
    timeLabels.push(startTime.plus({ minutes: i }).toFormat("h:mm a"));
  }

  try {
    // Fetch all temperature data from the Sensor collection for the thermocooler
    const sensors = await Sensor.find({
      thermocoolerId: id,
      sensorType: "temperature",
    }).sort({ lastUpdated: 1 });

    if (!sensors || sensors.length === 0) {
      return { error: "No temperature data found for this thermocooler" };
    }

    // Group the data in 5-minute intervals and create the sensorData object
    const sensorData = sensors.reduce((acc, sensor) => {
      const sensorTime = DateTime.fromJSDate(sensor.lastUpdated);
      const interval =
        Math.floor(sensorTime.diff(startTime, "minutes").minutes / 5) * 5;
      if (!acc[interval]) {
        acc[interval] = [];
      }
      acc[interval].push(sensor.value ? sensor.value : null); // Store temperature values for each interval
      return acc;
    }, {});

    // Generate unique colors for each sensor
    const colorScale = chroma
      .scale("Spectral")
      .mode("lab")
      .colors(sensors.length);

    // Create the datasets for each sensor
    const datasets = sensors.map((sensor, index) => ({
      label: `${sensor.name} ${
        sensor.value ? sensor.value + " degrees" : "(No Temp Avail)"
      }`,
      data: timeLabels.map((time, index) => {
        const interval = index * 5; // 5-minute interval
        const avgValue = sensorData[interval]
          ? average(sensorData[interval])
          : null; // If no data for the interval, set as null
        return avgValue;
      }),
      borderColor: colorScale[index], // Use unique color for each sensor
      backgroundColor: chroma(colorScale[index]).alpha(0.2).css(), // Semi-transparent background color
      fill: true,
    }));

    return { labels: timeLabels, datasets };
  } catch (error) {
    console.error("Error fetching temperature data:", error);
    return { error: "Failed to fetch temperature data" };
  }
};

//GET Energy Data for Single Thermocooler
const getEnergyData = async (req) => {
  const { id } = req.params;

  const now = DateTime.local(); // Current time
  const roundedNow = now.plus({ hours: 1 }).startOf("hour"); // Round up to the next hour
  const startTime = roundedNow.minus({ hours: 6 }); // Start time: 6 hours ago from rounded time
  const timeLabels = [];
  const energyData = [];

  // Generate 1-hour intervals for the last 6 hours
  for (let i = 0; i <= 6; i++) {
    timeLabels.push(startTime.plus({ hours: i }).toFormat("h:00 a"));
  }

  try {
    // Fetch energy consumption data from the Energy collection for the thermocooler
    const energy = await Energy.find({
      thermocoolerId: id,
      date: { $gte: startTime.toJSDate() }, // Use Luxon DateTime object converted to JS Date
    }).sort({ date: 1 });

    // Group the data in 1-hour intervals and create the energyConsumption object
    const energyConsumption = energy.reduce((acc, record) => {
      const energyTime = DateTime.fromJSDate(record.date); // Convert to Luxon DateTime
      const interval = Math.floor(energyTime.diff(startTime, "hours").hours);
      if (!acc[interval]) {
        acc[interval] = 0;
      }
      acc[interval] += record.energyConsumed; // Sum the energy consumption in each interval
      return acc;
    }, {});

    // Create the dataset for energy data
    const datasets = [
      {
        label: "Energy Usage (kWh)",
        data: timeLabels.map((time, index) => {
          const interval = index; // 1-hour interval index
          return energyConsumption[interval] || 0; // If no data, return 0
        }),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ];

    return { labels: timeLabels, datasets }; // Return the data, not the response
  } catch (error) {
    console.error("Error fetching energy data:", error);
    return { error: "Failed to fetch energy data" };
  }
};

// GET single thermocooler
const getThermocoolerData = async (req) => {
  const { id } = req.params;

  try {
    const thermocooler = await Thermocooler.findById(id);

    if (!thermocooler) {
      return { error: "Thermocooler not found." };
    }

    // Fetch real-time data from Arduino (mocking this for now)
    const arduinoData = {
      currentTemperature: 22.5, // Replace with Arduino real-time data
      powerUsage: 50, // Replace with Arduino real-time data
    };

    return {
      powerstate: thermocooler.powerstate,
      setTemperature: thermocooler.setTemperature,
      fanSpeed: thermocooler.fanSpeed,
      waterPumpVoltage: thermocooler.waterPumpVoltage,
      internalFanVoltage: thermocooler.internalFanVoltage,
      currentTemperature: arduinoData.currentTemperature,
      powerUsage: arduinoData.powerUsage,
    };
  } catch (error) {
    console.error("Error fetching thermocooler data:", error);
    return { error: "Failed to fetch thermocooler data" };
  }
};

// GET ALL REAL TIME DATA (Combined function to get temperature, energy, and thermocooler data)
const getAllThermocoolerData = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch temperature data
    const temperatureData = await getTemperatureData(req);

    // If there's an error with temperature data, return it
    if (temperatureData.error) {
      return res.status(404).json({ error: temperatureData.error });
    }

    // Fetch energy data
    const energyData = await getEnergyData(req);

    // If there's an error with energy data, return it
    if (energyData.error) {
      return res.status(404).json({ error: energyData.error });
    }

    // Fetch thermocooler data
    const thermocoolerData = await getThermocoolerData(req);

    // If there's an error with thermocooler data, return it
    if (thermocoolerData.error) {
      return res.status(404).json({ error: thermocoolerData.error });
    }

    // Send the combined response
    res.status(200).json({
      temperatureData: temperatureData,
      energyData: energyData,
      thermocoolerData: thermocoolerData,
    });
  } catch (error) {
    console.error("Error fetching all data:", error);
    res.status(500).json({
      error: "Failed to fetch all data due to server error",
    });
  }
};

//GET all users for user management
const getAllUser = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .populate("thermocoolers")
      .exec();

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    const usersData = users.map((user) => ({
      userId: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      thermocoolers: user.thermocoolers.map((tc) => ({
        id: tc._id,
        name: tc.name,
        setTemperature: tc.setTemperature ?? null,
        fanSpeed: tc.fanSpeed ?? null,
        waterPumpVoltage: tc.waterPumpVoltage ?? null,
        internalFanVoltage: tc.internalFanVoltage ?? null,
      })),
    }));

    res.status(200).json(usersData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

//Update Water Pump Voltage
const updateWaterPumpVoltage = async (req, res) => {
  try {
    const { id } = req.params; // Thermocooler ID from route parameters
    const { waterPumpVoltage } = req.body; // Desired voltage from request body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid thermocooler ID." });
    }

    if (
      typeof waterPumpVoltage !== "number" ||
      waterPumpVoltage < 0 ||
      waterPumpVoltage > 12
    ) {
      return res.status(400).json({
        error:
          "Invalid waterPumpVoltage. Must be a number between 0 and 12 volts.",
      });
    }

    const thermocooler = await Thermocooler.findByIdAndUpdate(
      id,
      { waterPumpVoltage },
      { new: true }
    );

    if (!thermocooler) {
      return res.status(404).json({ error: "Thermocooler not found." });
    }

    // Send command to Arduino
    try {
      console.log(
        `Arduino Command: Set water pump voltage to ${waterPumpVoltage}`
      );
      // Example: await sendCommandToArduino(id, waterPumpVoltage);
    } catch (arduinoError) {
      console.error("Arduino communication failed:", arduinoError.message);
      await Thermocooler.findByIdAndUpdate(id, {
        waterPumpVoltage: thermocooler.waterPumpVoltage,
      });
      return res
        .status(500)
        .json({ error: "Failed to communicate with Arduino." });
    }

    res.status(200).json({
      message: `Water pump voltage updated to ${waterPumpVoltage}V successfully.`,
      thermocooler,
    });
  } catch (error) {
    console.log("Unexpected error:", error.message);
  }
};

//Update Internal Fan Voltage
const updateInternalFanVoltage = async (req, res) => {
  try {
    const { id } = req.params; // Thermocooler ID from route parameters
    const { internalFanVoltage } = req.body; // Desired voltage from request body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid thermocooler ID." });
    }

    if (
      typeof internalFanVoltage !== "number" ||
      internalFanVoltage < 0 ||
      internalFanVoltage > 12
    ) {
      return res.status(400).json({
        error:
          "Invalid internalFanVoltage. Must be a number between 0 and 12 volts.",
      });
    }

    const thermocooler = await Thermocooler.findByIdAndUpdate(
      id,
      { internalFanVoltage },
      { new: true }
    );

    if (!thermocooler) {
      return res.status(404).json({ error: "Thermocooler not found." });
    }

    // Send command to Arduino
    try {
      console.log(
        `Arduino Command: Set internal fan voltage to ${internalFanVoltage}`
      );
      // Example: await sendCommandToArduino(id, internalFanVoltage);
    } catch (arduinoError) {
      console.error("Arduino communication failed:", arduinoError.message);
      await Thermocooler.findByIdAndUpdate(id, {
        internalFanVoltage: thermocooler.internalFanVoltage,
      });
      return res
        .status(500)
        .json({ error: "Failed to communicate with Arduino." });
    }

    res.status(200).json({
      message: `Internal fan voltage updated to ${internalFanVoltage}V successfully.`,
      thermocooler,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update internal fan voltage." });
  }
};

module.exports = {
  getAllThermocoolerData,
  getAllUser,
  updateInternalFanVoltage,
  updateWaterPumpVoltage,
};
