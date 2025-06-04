import React, { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/send-reset-link",
        { email }
      );
      alert("Reset password link sent to your email!");
      console.log("Reset password link sent:", response.data);
      setSuccess("Reset password link sent to your email!");
      setError(null);
    } catch (err) {
      console.error("Failed to send reset password link:", err);
      setError("Failed to send reset password link. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="flex justify-center h-screen items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
            >
              Send Reset Link
            </button>
          </div>
          {success && <p className="text-green-600">{success}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
