// src/components/NewPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useLoader } from "../utility/LoaderContext";
import { MdLockReset } from "react-icons/md";
import { USERS_API_URL } from "../utility/api";

const NewPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { loader } = useLoader();

  const [newPassword, setNewPassword] = useState(""); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleNewPassword = async (e) => {
    e.preventDefault();

    loader(true);
    try {
      await axios.post(
        `${USERS_API_URL}/reset-password/${token}`,
        { newPassword }
      );
      setSuccess("Password reset successful! Redirecting to login...");
      setError(null);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Password reset failed:", err);
      setError("Password reset failed. Please try again.");
      setSuccess(null);
    } finally {
      loader(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 pb-8 pt-20">
      <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Choose a new password
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Your new password must be at least 6 characters.
        </p>
        <form onSubmit={handleNewPassword} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              placeholder="At least 6 characters"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
          {success && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{success}</p>}
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
          >
            <MdLockReset aria-hidden="true" size={20} />
            Update password
          </button>
        </form>
      </section>
    </main>
  );
};

export default NewPassword;
