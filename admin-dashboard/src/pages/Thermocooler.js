import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuthContext } from "../hooks/useAuthContext";
import { useUserThermoContext } from "../hooks/useUserThermoContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Thermocooler = () => {
  const { user } = useAuthContext();
  const { userData } = useUserThermoContext();
  const [tempData, setTempData] = useState({
    labels: [],
    datasets: [],
  });
  const [energyData, setEnergyData] = useState({
    labels: [],
    datasets: [],
  });
  const [thermocoolerData, setThermocoolerData] = useState({
    setTemperature: 22,
    fanSpeed: 50,
    waterPumpVoltage: 9,
    internalFanVoltage: 6,
  });
  const [loading, setLoading] = useState(true);

  // Handle changes in the temperature and fan speed inputs
  // Generic handler for all input changes
  const handleInputChange = (field) => (e) => {
    setThermocoolerData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  useEffect(() => {
    const fetchAllThermocoolerData = async () => {
      if (user && userData) {
        try {
          const response = await fetch(
            `/api/admin/${userData.thermocooler.id}/real-time-data`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          const json = await response.json();

          if (response.ok) {
            setTempData(json.temperatureData);
            setEnergyData(json.energyData);
            setThermocoolerData(json.thermocoolerData);
          }
        } catch (err) {
          console.log("Error" + err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAllThermocoolerData();
  }, [user, userData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-6 p-6">
      {/* User Controls */}
      <div className="bg-white p-4 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">User Controls</h2>
        <div className="flex mb-4">
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="h-12 w-12 rounded-full mr-3"
          />
          <div>
            <h2 className="font-semibold text-xl">{userData.username}</h2>
            <p className="text-gray-600">{userData.email}</p>
          </div>
        </div>
        <p className="mb-2">
          <strong>Thermocooler Name: </strong>
          {userData.thermocooler.name}
        </p>
        <p className="mb-2">
          <strong>Thermocooler ID: </strong>
          {userData.thermocooler.id}
        </p>
        {thermocoolerData && (
          <>
            <div className="mb-4">
              <label htmlFor="temperature" className="block font-medium">
                Set Temperature:
              </label>
              <input
                id="temperature"
                type="number"
                min="16"
                max="30"
                value={thermocoolerData.setTemperature}
                onChange={handleInputChange("setTemperature")} // Add the onChange handler
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
            <div>
              <label htmlFor="fan-speed" className="block font-medium mb-3">
                Fan Speed: {thermocoolerData.fanSpeed}%
              </label>
              <input
                id="fan-speed"
                type="range"
                min="0"
                value={thermocoolerData.fanSpeed}
                onChange={handleInputChange("fanSpeed")} // Add the onChange handler
                max="100"
                className="w-full mt-1 bg-blue-800"
              />
            </div>
          </>
        )}
      </div>

      <div className="bg-white p-4 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Real-Time Temperature</h2>
        <Line data={tempData} />
        <p className="mt-4 text-center font-medium">Status: Stable</p>
        <p className=" text-center font-medium">
          Current Temperature:{thermocoolerData.currentTemperature}{" "}
        </p>
      </div>
      {/* Admin Controls */}
      <div className="bg-white p-4 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Admin Controls</h2>
        <div className="mb-4">
          <label htmlFor="pump-voltage" className="block font-medium">
            Water Pump Voltage:
          </label>
          <input
            id="pump-voltage"
            type="number"
            min="5"
            max="12"
            value={thermocoolerData.waterPumpVoltage}
            onChange={handleInputChange("waterPumpVoltage")}
            className="w-full p-2 border rounded-md mt-1"
          />
          <p className="text-sm mt-1">Range: 5V - 12V</p>
        </div>
        <div>
          <label htmlFor="fan-voltage" className="block font-medium">
            Internal Fan Voltage:
          </label>
          <input
            id="fan-voltage"
            type="number"
            min="3"
            max="9"
            value={thermocoolerData.internalFanVoltage}
            onChange={handleInputChange("internalFanVoltage")}
            className="w-full p-2 border rounded-md mt-1"
          />
          <p className="text-sm mt-1">Range: 3V - 9V</p>
        </div>
      </div>
      <div className="bg-white p-4 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Real-Time Energy Usage</h2>
        <Line data={energyData} />
        <p className="mt-4 text-right font-medium">Usage: 1.5 kWh</p>
      </div>
    </div>
  );
};

export default Thermocooler;
