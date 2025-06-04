import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.schema.js";
dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_CODE);
    req.user = await User.findById(decoded.id).select("-password");
    console.log("Authenticated user:", req.user);
    if (!req.user) {
      return res.status(404).json({ message: "User not found." });
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(400).json({ message: "Invalid token." });
  }
};
export default authMiddleware;
