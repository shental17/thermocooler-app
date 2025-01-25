// src/hooks/useUserThermoContext.js

import { useContext } from "react";
import { UserThermoContext } from "../context/UserThermoContext";

export const useUserThermoContext = () => {
  const context = useContext(UserThermoContext);

  if (!context) {
    throw new Error(
      "useUserThermoContext must be used inside a UserThermoContextProvider"
    );
  }

  return context;
};
