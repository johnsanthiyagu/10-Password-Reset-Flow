import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoader } from "../utility/LoaderContext";
import { useAuth } from "../utility/AuthContext";
import { MdLogin, MdLockReset, MdPersonAdd } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { loader } = useLoader();

  const handleLogin = async (e) => {
    e.preventDefault();
    loader(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        {
          email,
          password,
        }
      );
      login(response.data);
      setError(null);
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Login failed:", err.message);
      setError(
        err.response?.data?.message ||
        (err.response
          ? "Login failed. Please check your email and password."
          : "Cannot reach the backend. Start the backend server and try again.")
      );
    }
    finally {
      loader(false);
    };
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 pb-8 pt-20">
      <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">Welcome back</h1>
        <p className="mb-6 text-center text-sm text-gray-600">Log in to continue to your account.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
          >
            <MdLogin aria-hidden="true" size={20} />
            Login
          </button>
        </form>
        <div className="mt-5 flex flex-col items-center gap-3 text-sm">
          <Link to="/reset-password" className="inline-flex items-center gap-1 font-medium text-green-800 hover:underline">
            <MdLockReset aria-hidden="true" size={18} />
            Forgot your password?
          </Link>
          <p className="text-gray-600">
            New here?{" "}
            <Link to="/register" className="inline-flex items-center gap-1 font-semibold text-green-800 hover:underline">
              <MdPersonAdd aria-hidden="true" size={18} />
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
