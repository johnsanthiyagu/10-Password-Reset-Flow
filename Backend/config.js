import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });
const connectDB = async () => {
  const connectionString = process.env.CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("CONNECTION_STRING is missing from Backend/.env.");
  }

  await mongoose.connect(connectionString);
  console.log("MongoDB connected successfully");
};
export default connectDB;
