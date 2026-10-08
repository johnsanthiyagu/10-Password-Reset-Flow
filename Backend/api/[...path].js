import app from "../app.js";
import connectDB from "../config.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("API request failed:", error.message);
    return res.status(503).json({ message: "The API is temporarily unavailable." });
  }
}
