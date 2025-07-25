// src/components/NewPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const NewPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState(""); 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleNewPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:4000/api/users/reset-password/${token}`,
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
    }
  };

  return (
    <div className="flex justify-center h-screen items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Set New Password
        </h2>
        <form onSubmit={handleNewPassword}>
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter new password"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Reset Password
          </button>
        </form>
        {success && <p className="text-green-600 mt-4">{success}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default NewPassword;
