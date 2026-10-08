import express from "express";
import cors from "cors";
import router from "./router/user.router.js";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import connectDB from "./config.js";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const app = express();
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean),
]);

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, !origin || allowedOrigins.has(origin));
    },
  })
);
app.use(express.json());
app.use(async (req, res, next) => {
  if (req.method === "OPTIONS" || (req.method === "GET" && req.path === "/api/health")) {
    return next();
  }

  try {
    await connectDB();
    return next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return res.status(503).json({ message: "The service is temporarily unavailable." });
  }
});
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/api/users", router);

export default app;
