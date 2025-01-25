import { createContext, useReducer, useEffect } from "react";

export const UserThermoContext = createContext();

// Reducer function to manage user and thermocooler data
export const UserThermoReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, userData: action.payload };
    default:
      return state;
  }
};

// Context provider to wrap around your app and provide global state
export const UserThermoContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(UserThermoReducer, {
    userData: null, // stores the userData and thermocooler
  });

  // Load the user data and thermocooler from localStorage on mount
  useEffect(() => {
    const savedUserData = JSON.parse(localStorage.getItem("userData"));

    if (savedUserData) {
      dispatch({ type: "SET_USER", payload: savedUserData });
    }
  }, []);

  console.log("UserThermoContext state:  ", state);
  return (
    <UserThermoContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserThermoContext.Provider>
  );
};
