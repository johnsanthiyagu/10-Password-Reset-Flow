import { Link, useNavigate } from "react-router-dom";
import { MdHome, MdLogin, MdLogout, MdPersonAdd } from "react-icons/md";
import { useAuth } from "../utility/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="fixed top-0 z-10 w-full">
      <div className="flex h-12 w-full items-center justify-center bg-green-900">
        <nav aria-label="Main navigation" className="flex items-center gap-4 text-base font-bold text-white sm:text-lg">
          {isAuthenticated ? (
            <>
              <Link to="/home" className="inline-flex items-center gap-1.5 hover:text-white/80">
                <MdHome aria-hidden="true" size={21} />
                Home
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 hover:text-white/80"
              >
                <MdLogout aria-hidden="true" size={21} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center gap-1.5 hover:text-white/80">
                <MdLogin aria-hidden="true" size={21} />
                Login
              </Link>
              <Link to="/register" className="inline-flex items-center gap-1.5 hover:text-white/80">
                <MdPersonAdd aria-hidden="true" size={21} />
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
