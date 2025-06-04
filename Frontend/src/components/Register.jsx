import axios from "axios";
import React, { useState } from "react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/register",
        {
          name,
          email,
          password,
        }
      );
      alert("Registration successful!");
      console.log("Registration successful:", response.data);
      setSuccess("Registration successful!");
      setError(null);

      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="flex justify-center h-screen items-center bg-gray-100">
      <div>
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">
            New User Register
          </h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your name"
                required
              />
            </div>
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
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors duration-200"
            >
              Register
            </button>

            {success && <p className="text-green-600 mt-4">{success}</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
