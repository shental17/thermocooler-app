import { Link } from "react-router-dom";

function ThermocoolerList({ thermocoolers }) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium">Thermocoolers:</h3>
      {thermocoolers.map((thermo) => (
        <Link
          to={`/thermocooler/${thermo.id}`}
          key={thermo.id}
          className="block py-1 text-blue-600 hover:text-blue-800"
        >
          {thermo.name} (ID: {thermo.id})
        </Link>
      ))}
    </div>
  );
}

const UserDetails = ({ user }) => {
  return (
    <div key={user.id} className="bg-white rounded-md border p-4">
      <h2 className="font-semibold text-xl">{user.username}</h2>
      <p className="text-gray-600">{user.email}</p>
      <ThermocoolerList thermocoolers={user.thermocoolers} />
    </div>
  );
};

export default UserDetails;
