import express from "express";
import userController from "../controllers/user.controllers.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();
// User registration route
router.post("/register", userController.register);
// User login route
router.post("/login", userController.login);
// Get user profile route (protected)
router.get("/profile", authMiddleware, userController.getUser);
// Export the user router
router.put("/reset-password", userController.updatePasswordByEmail);
// This code defines the user router for handling user-related routes such as registration, login, and profile retrieval.
// Send password reset link to user's email
router.post("/send-reset-link", userController.sendResetLink);

// Handle password reset via token (frontend will call this after user enters new password)
router.post("/reset-password/:token", userController.resetPasswordByToken);
export default router;
