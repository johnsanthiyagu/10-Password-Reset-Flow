  import { BrowserRouter, Route, Routes } from "react-router-dom";
  import Navbar from "./components/Navbar";
  import Login from "./components/Login";
  import Register from "./components/Register";
  import ResetPassword from "./components/ResetPassword";
  import NewPassword from "./components/NewPassword"; // <-- import new component

  function App() {
    return (
      <>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/:token" element={<NewPassword />} />{" "}
            {/* <-- new route */}
          </Routes>
        </BrowserRouter>
      </>
    );
  }

  export default App;
