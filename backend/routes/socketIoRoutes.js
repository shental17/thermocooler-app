module.exports = function socketIoRoutes(client) {
  console.log("A device connected:", client.id);

  // Listen for sensor data from ESP32
  client.on("sensorReadings", (data) => {
    console.log("Received sensor data:", data);

    // Broadcast sensor data to all connected clients (React Native)
    client.broadcast.emit("updateSensorData", data);
  });

  // Handle ESP32 disconnecting
  client.on("disconnect", () => {
    console.log("Device disconnected:", client.id);
  });
};
