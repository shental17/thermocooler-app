import React from "react";
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
  // Dummy data for the charts
  const tempData = {
    labels: ["1 PM", "2 PM", "3 PM", "4 PM", "5 PM"], // X-axis labels
    datasets: [
      {
        label: "Sensor 1 Temperature (°C)",
        data: [22, 23, 24, 25, 23],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Sensor 2 Temperature (°C)",
        data: [21, 22, 23, 24, 22],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Sensor 3 Temperature (°C)",
        data: [23, 24, 25, 26, 24],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
      {
        label: "Sensor 4 Temperature (°C)",
        data: [24, 25, 26, 27, 25],
        borderColor: "rgb(133, 54, 235)",
        backgroundColor: "rgba(153, 119, 234, 0.2)",
        fill: true,
      },
    ],
  };

  const energyData = {
    labels: ["1 PM", "2 PM", "3 PM", "4 PM", "5 PM"],
    datasets: [
      {
        label: "Energy Usage (kWh)",
        data: [1.2, 1.4, 1.6, 1.3, 1.5],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-6 p-6">
      {/* User Controls */}
      <div className="bg-white p-4 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">User Controls</h2>
        <p className="mb-2">Name: John Doe</p>
        <p className="mb-2">Thermocooler ID: TC12345</p>
        <div className="mb-4">
          <label htmlFor="temperature" className="block font-medium">
            Set Temperature:
          </label>
          <input
            id="temperature"
            type="number"
            min="16"
            max="30"
            className="w-full p-2 border rounded-md mt-1"
          />
        </div>
        <div>
          <label htmlFor="fan-speed" className="block font-medium mb-3">
            Fan Speed:
          </label>
          <input
            id="fan-speed"
            type="range"
            min="0"
            max="100"
            className="w-full mt-1 bg-blue-800"
          />
        </div>
      </div>

      {/* Data */}
      <div className="bg-white p-4 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Real-Time Temperature</h2>
        <Line data={tempData} />
        <p className="mt-4 text-center font-medium">Status: Stable</p>
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
            className="w-full p-2 border rounded-md mt-1"
          />
          <p className="text-sm mt-1">Range: 3V - 9V</p>
        </div>
      </div>

      {/* Energy Usage */}
      <div className="bg-white p-4 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">Real-Time Energy Usage</h2>
        <Line data={energyData} />
        <p className="mt-4 text-right font-medium">Usage: 1.5 kWh</p>
      </div>
    </div>
  );
};

export default Thermocooler;
