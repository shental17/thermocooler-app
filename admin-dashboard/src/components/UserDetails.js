import { Link } from "react-router-dom";
import { useUserThermoContext } from "../hooks/useUserThermoContext";

function ThermocoolerList({ thermocoolers, user }) {
  const { dispatch } = useUserThermoContext();
  const handleThermocoolerClick = (thermocooler) => {
    // Create a single object containing both the user and thermocooler information
    const singleUserData = {
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      thermocooler: {
        id: thermocooler.id,
        name: thermocooler.name,
      },
    };
    dispatch({ type: "SET_USER", payload: singleUserData });
    localStorage.setItem("userData", JSON.stringify(singleUserData));
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium">
        {thermocoolers && thermocoolers.length > 0
          ? "Thermocoolers:"
          : "No thermocoolers available"}
      </h3>
      {thermocoolers && thermocoolers.length > 0
        ? thermocoolers.map((thermo) => (
            <Link
              to={`/thermocooler/${thermo.id}`}
              key={thermo.id}
              className="block py-1 text-blue-600 hover:text-blue-800"
              onClick={() => handleThermocoolerClick(thermo)}
            >
              {thermo.name} (ID: {thermo.id})
            </Link>
          ))
        : ""}
    </div>
  );
}

const UserDetails = ({ user }) => {
  return (
    <div key={user.id} className="bg-white rounded-md border p-4">
      <div className="flex">
        <img
          src={user.profilePicture}
          alt="Profile"
          className="h-12 w-12 rounded-full mr-3"
        />
        <div>
          <h2 className="font-semibold text-xl">{user.username}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <ThermocoolerList thermocoolers={user.thermocoolers} user={user} />
    </div>
  );
};

export default UserDetails;
