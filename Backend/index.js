import express from "express";
import dotenv from "dotenv";
import connectDB from "./config.js";
import router from "./router/user.router.js";
import cors from "cors";

dotenv.config();
const app = express();
connectDB(); // Connect to MongoDB
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use("/api/users", router); // Use the user router for user-related routes
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
