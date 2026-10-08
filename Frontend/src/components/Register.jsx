import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdPersonAdd, MdLogin } from "react-icons/md";
import { useLoader } from "../utility/LoaderContext";
import { USERS_API_URL } from "../utility/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { loader } = useLoader();

  const handleRegister = async (e) => {
    e.preventDefault();
    loader(true);
    try {
      const response = await axios.post(
        `${USERS_API_URL}/register`,
        {
          name,
          email,
          password,
        }
      );
      setSuccess(response.data.message || "Registration successful!");
      setError(null);

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Registration failed:", err.message);
      setError(
        err.response?.data?.message ||
          (err.response
            ? "Registration failed. Please try again."
            : "Cannot reach the backend. Start the backend server and try again.")
      );
      setSuccess(null);
    } finally {
      loader(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 pb-8 pt-20">
      <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Create your account
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Get started by entering your details below.
        </p>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              placeholder="Enter your name"
              autoComplete="name"
              required
            />
          </div>
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
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>
          {success && (
            <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
              {success}
            </p>
          )}
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
          >
            <MdPersonAdd aria-hidden="true" size={20} />
            Create account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-green-800 hover:underline">
            <MdLogin aria-hidden="true" size={18} />
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
