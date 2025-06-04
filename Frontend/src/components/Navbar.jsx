import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className="top-0 fixed">
        <div className="flex justify-center h-12 w-screen bg-green-900">
          <div className="text-xl text-white font-bold flex justify-center items-center gap-4">
            <Link to="/login" className=" cursor-pointer hover:text-white/80">
              Login
            </Link>
            <Link
              to="/register"
              className=" cursor-pointer hover:text-white/80"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
