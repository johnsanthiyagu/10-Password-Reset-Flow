import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import NewPassword from "./components/NewPassword"; // <-- import new component
import { LoaderProvider } from "./utility/LoaderContext";
import { AuthProvider } from "./utility/AuthContext";
import Welcome from "./components/Welcome";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoaderProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/home" element={<Welcome />} />
            <Route path="/reset-password/:token" element={<NewPassword />} />{" "}
            {/* <-- new route */}
          </Routes>
        </LoaderProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
