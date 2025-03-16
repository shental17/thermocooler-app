const { exec } = require("child_process");
const path = require("path");

const controlPlugPowerState = (powerState) => {
  return new Promise((resolve, reject) => {
    const pythonPowerStatePath = path.resolve(
      __dirname,
      "../pythonScripts/controlPlugPowerState.py"
    );

    // Use `sudo` to run the script
    exec(
      `sudo python3 ${pythonPowerStatePath} ${powerState ? "on" : "off"}`,
      (err, stdout, stderr) => {
        if (err) {
          reject(`Error executing Python script: ${stderr || err.message}`);
        } else {
          resolve(stdout.trim()); // Return script output
        }
      }
    );
  });
};

const getPlugEnergyUsage = () => {
  return new Promise((resolve, reject) => {
    const pythonEnergyUsagePath = path.resolve(
      __dirname,
      "../pythonScripts/getPlugEnergyUsage.py"
    );

    console.log("Getting plug energy usage...");

    // Run the Python script with sudo
    exec(`sudo python3 ${pythonEnergyUsagePath}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing Python script: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
      }

      if (!stdout.trim()) {
        reject("No output from Python script.");
        return;
      }

      console.log("Raw script output:", stdout);

      try {
        const energyData = JSON.parse(stdout.trim());
        console.log("Parsed energy usage data:", energyData);
        resolve(energyData);
      } catch (parseError) {
        reject(`Error parsing energy usage data: ${parseError.message}`);
      }
    });
  });
};

module.exports = {
  controlPlugPowerState,
  getPlugEnergyUsage,
};
