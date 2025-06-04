import jwt from "jsonwebtoken";
import User from "../models/user.schema.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

const userController = {
  register: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_CODE, {
        expiresIn: "1h",
      });
      res.status(201).json({
        message: "User registered successfully.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password." });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_CODE, {
        expiresIn: "1h",
      });
      res.status(200).json({
        message: "Login successful.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },

  updatePasswordByEmail: async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required." });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      console.error("Update password error:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },

  sendResetLink: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const token = crypto.randomBytes(32).toString("hex");
      const expiry = Date.now() + 3600000; // 1 hour

      user.resetPasswordToken = token;
      user.resetPasswordExpires = expiry;
      await user.save();

      const resetUrl = `http://localhost:5173/reset-password/${token}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        to: email,
        subject: "Password Reset",
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
      });

      res.json({ message: "Password reset link sent." });
    } catch (error) {
      console.error("Send reset link error:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },

  resetPasswordByToken: async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    // ✅ Add this block right after getting the token
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return res.status(400).json({ message: "Invalid token format." });
    }

    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ message: "Password reset successful." });
    } catch (error) {
      console.error("Reset password error:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },
};

export default userController;
