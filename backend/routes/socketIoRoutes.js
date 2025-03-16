module.exports = function socketIoRoutes(client) {
  const io = client.server;

  // Initialize deviceRegistry globally
  if (!io.deviceRegistry) {
    io.deviceRegistry = {}; // Initialize if it doesn't exist
  }
  if (!io.sensorData) {
    io.sensorData = {};
  }
  console.log("A device connected:", client.id);

  // Listen for sensor data from ESP32
  client.on("sensorReadings", (data) => {
    console.log("Received sensor data:", data);
    // Store the latest sensor data in memory based on MAC address
    if (data.macAddress) {
      io.sensorData[data.macAddress] = data;
    }
  });

  // Listen for device registration (MAC address)
  client.on("registerDevice", (macAddress) => {
    console.log("Mac Address received: ", macAddress);
    // Map the MAC address to the current socket client ID
    io.deviceRegistry[macAddress] = client.id;
    console.log(
      `Device with MAC ${macAddress} registered with client ID ${client.id}`
    );
  });

  // Handle ESP32 disconnecting
  client.on("disconnect", () => {
    console.log("Device disconnected:", client.id);
    // Optionally, handle cleanup or mark the device as disconnected in your system
    for (let macAddress in io.deviceRegistry) {
      if (io.deviceRegistry[macAddress] === client.id) {
        console.log(`Device with MAC ${macAddress} disconnected`);
        delete io.deviceRegistry[macAddress];
        delete io.sensorData[macAddress];
      }
    }
  });

  // Function to emit data to a specific device based on its MAC address
  function emitToDevice(macAddress, event, data) {
    const targetClientId = io.deviceRegistry[macAddress];
    if (targetClientId) {
      console.log(`Emitting to device with MAC ${macAddress}`);
      client.to(targetClientId).emit(event, data);
    } else {
      console.log(`Device with MAC ${macAddress} not found.`);
    }
  }

  // Example of emitting data to the device
  client.on("sendDataToDevice", (macAddress, data) => {
    emitToDevice(macAddress, "sensorData", data);
  });
};
