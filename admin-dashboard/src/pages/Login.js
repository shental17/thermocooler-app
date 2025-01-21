import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="w-1/2 bg-gray-200">
          <img
            src="./assets/home.png" // Replace with your image URL
            alt="Login Image"
            className="object-cover w-full h-full"
          />
        </div>

        <div className="w-1/2 p-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
          </div>

          <form className="login space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                autoComplete="email"
                required
                className="block w-full rounded-md bg-gray-100 p-3 text-base text-black placeholder:text-gray-500 focus:outline focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                autoComplete="current-password"
                required
                className="block w-full rounded-md bg-gray-100 p-3 text-base text-black placeholder:text-gray-500 focus:outline focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-md p-3 font-semibold shadow-sm focus:outline-none focus:ring-2 
                    ${
                      isLoading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-600"
                    }`}
              >
                Login
              </button>
            </div>
            {error && (
              <p className="mt-2 p-2 text-sm bg-red-100 text-red-500 rounded-md">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
