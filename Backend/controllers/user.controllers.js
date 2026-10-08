import jwt from "jsonwebtoken";
import User from "../models/user.schema.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const userController = {
  register: async (req, res) => {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          message:
            "An account with this email already exists. Please try another email or log in.",
        });
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
      if (error.code === 11000 && error.keyPattern?.email) {
        return res.status(409).json({
          message:
            "An account with this email already exists. Please try another email or log in.",
        });
      }
      console.error("Registration error:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },

  login: async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
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
    const email = req.body.email?.trim().toLowerCase();
    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");
    if (!emailUser || !emailPass) {
      console.error("Password reset email configuration is incomplete.");
      return res
        .status(500)
        .json({ message: "Password reset email is not configured on the server." });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const token = crypto.randomBytes(32).toString("hex");
      const expiry = Date.now() + 3600000;

      user.resetPasswordToken = token;
      user.resetPasswordExpires = expiry;
      await user.save();

      const frontendUrl = (
        process.env.FRONTEND_URL || "http://localhost:5173"
      ).replace(/\/+$/, "");
      const resetUrl = `${frontendUrl}/reset-password/${token}`;
      const expiresAt = new Date(expiry).toUTCString();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      await transporter.sendMail({
        from: {
          name: "Password Reset Flow",
          address: emailUser,
        },
        replyTo: emailUser,
        to: email,
        subject: "Reset your Password Reset Flow password",
        text: `We received a request to reset your password. Use this link to choose a new password:\n${resetUrl}\n\nThis link expires in 1 hour, at ${expiresAt}. If you didn't request a password reset, you can ignore this email.`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1f2937">
            <h1 style="font-size:24px;margin:0 0 16px">Reset your password</h1>
            <p style="line-height:1.6">We received a request to reset your password. Use the button below to choose a new one.</p>
            <p style="margin:28px 0">
              <a href="${resetUrl}" style="display:inline-block;padding:12px 22px;background:#15803d;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold">Reset password</a>
            </p>
            <p style="line-height:1.6">This link expires in <strong>1 hour</strong>, at <strong>${expiresAt}</strong>.</p>
            <p style="font-size:13px;color:#6b7280;line-height:1.6">If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
        `,
      });

      res.json({ message: "Password reset link sent. Please check your email or spam folder." });
    } catch (error) {
      console.error("Send reset link error:", {
        code: error.code,
        responseCode: error.responseCode,
      });
      res
        .status(500)
        .json({
          message:
            "Could not send the reset email. Check the backend email settings and Gmail app password.",
        });
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
