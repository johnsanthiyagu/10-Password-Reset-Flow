import express from "express";
import connectDB from "./config.js";
import router from "./router/user.router.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use("/api/users", router); // Use the user router for user-related routes

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exitCode = 1;
  }
};

startServer();
