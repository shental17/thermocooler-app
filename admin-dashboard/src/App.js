import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

//pages and components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Thermocooler from "./pages/Thermocooler";
import Navbar from "./components/Navbar";

function AppContent() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <div className={`flex `}>
        <div className={`${user ? "" : "hidden"}`}>
          <Navbar />
        </div>
        <div className="flex-1 p-4">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/thermocooler/:thermocoolerId"
              element={user ? <Thermocooler /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
