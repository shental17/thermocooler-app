import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import UserDetails from "../components/UserDetails";

const usersData = [
  {
    id: "1",
    username: "John Doe",
    email: "john@example.com",
    thermocoolers: [
      {
        id: "A123",
        name: "Main Room Cooler",
      },
      {
        id: "B456",
        name: "Bedroom Cooler",
      },
    ],
  },
  {
    id: "2",
    username: "Jane Smith",
    email: "jane@example.com",
    thermocoolers: [
      {
        id: "C789",
        name: "Living Room Cooler",
      },
    ],
  },
];

const Home = () => {
  const [search, setSearch] = useState("");
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch("/api/admin", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        console.log(JSON.stringify(json));
      }
    };
    if (user) {
      fetchUserData();
    }
  }, []);

  const filteredUsers = usersData.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.thermocoolers.some(
        (thermo) =>
          thermo.name.toLowerCase().includes(search.toLowerCase()) ||
          thermo.id.includes(search)
      )
  );

  return (
    <div className=" p-4">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      <input
        type="text"
        className="rounded-md border p-2 mb-4 w-full"
        placeholder="Search by user or thermocooler name/ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <UserDetails key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Home;
