const { PythonShell } = require("python-shell");
const path = require("path");

const controlPlugPowerState = (powerState) => {
  return new Promise((resolve, reject) => {
    const pythonPowerStatePath = path.resolve(
      __dirname,
      "../pythonScripts/controlPlugPowerState.py"
    );
    const options = {
      args: [powerState ? "on" : "off"], // Pass the powerState to the Python script
    };

    PythonShell.run(pythonPowerStatePath, options, (err, results) => {
      if (err) {
        reject(`Error executing Python script: ${err}`);
      } else {
        resolve(results);
      }
    });
  });
};

const getPlugEnergyUsage = () => {
  const pythonEnergyUsagePath = path.resolve(
    __dirname,
    "../pythonScripts/getPlugEnergyUsage.py"
  );

  console.log("Getting plug energy usage...");

  // Run the Python script
  PythonShell.run(pythonEnergyUsagePath, null).then((messages) => {
    // results is an array consisting of messages collected during execution
    console.log("results: %j", messages[6]);
    const rawMessage = messages[messages.length - 1];
    console.log("energyUsageData in String Format: %j", rawMessage);
    const cleanedMessage = rawMessage
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .trim(); // Remove any extra spaces
    console.log("energyUsageData in cleaned Format: %j", cleanedMessage);
    try {
      const energyData = JSON.parse(cleanedMessage);
      console.log("Parsed energy usage data:", energyData);
      return energyData;
    } catch (parseError) {
      console.error("Error parsing energy usage data:", parseError);
    }
  });
};

module.exports = {
  controlPlugPowerState,
  getPlugEnergyUsage,
};
