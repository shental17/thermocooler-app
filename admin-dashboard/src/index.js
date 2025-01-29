import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { UserThermoContextProvider } from "./context/UserThermoContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <UserThermoContextProvider>
        <App />
      </UserThermoContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
