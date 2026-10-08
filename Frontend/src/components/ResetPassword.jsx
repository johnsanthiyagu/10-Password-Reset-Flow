import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdLockReset, MdLogin } from "react-icons/md";
import { useLoader } from "../utility/LoaderContext";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { loader } = useLoader();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    loader(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/send-reset-link",
        { email }
      );
      setSuccess(response.data.message || "Reset password link sent to your email.");
      setError(null);
    } catch (err) {
      console.error("Failed to send reset password link:", err.message);
      setError(
        err.response?.data?.message ||
          (err.response
            ? "Failed to send reset password link. Please try again."
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
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">Reset your password</h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your account email and we&apos;ll send you a secure reset link.
        </p>
        <form onSubmit={handleResetPassword} className="space-y-4">
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
          {success && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{success}</p>}
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
          >
            <MdLockReset aria-hidden="true" size={20} />
            Send reset link
          </button>
        </form>
        <p className="mt-5 text-center text-sm">
          <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-green-800 hover:underline">
            <MdLogin aria-hidden="true" size={18} />
            Back to log in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default ResetPassword;
