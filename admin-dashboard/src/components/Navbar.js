import { Link } from "react-router-dom";
import { UserIcon, Cog8ToothIcon } from "@heroicons/react/24/solid";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };
  return (
    <header>
      <div>
        <div className="h-screen w-48 bg-white text-black p-4 shadow-lg">
          <div className="flex items-center mb-4 ml-3">
            {user && (
              <>
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-12 w-12 rounded-full mr-3"
                />
                <h2 className="text-lg font-semibold">{user.username}</h2>
              </>
            )}
          </div>

          <ul>
            <li>
              <Link
                to="/"
                className="rounded-lg w-full flex block py-2 px-4 hover:bg-gray-100"
              >
                <UserIcon className="h-6 w-6 mr-2" />
                Users
              </Link>
            </li>
            <li>
              <button
                onClick={handleClick}
                className="rounded-lg w-full flex block py-2 px-4 hover:bg-gray-100"
              >
                <Cog8ToothIcon className="h-6 w-6 mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
