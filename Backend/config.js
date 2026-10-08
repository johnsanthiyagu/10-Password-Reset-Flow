import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

let connectionPromise;

const connectDB = async () => {
  const connectionString = process.env.CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("CONNECTION_STRING is missing from Backend/.env.");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise || mongoose.connection.readyState === 0) {
    connectionPromise = mongoose.connect(connectionString).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
  console.log("MongoDB connected successfully");
};

export default connectDB;
