const express = require("express");
const { register, login, updateProfile, forgotPassword, resetPassword, verifyEmail } = require("../controllers/userController");
const authMiddleware = require("../middleware/authmiddleware");
const limiter = require("../middleware/rateLimiter");
const errorHandler = require("../middleware/errorHandler");
const User = require("../models/user"); // Make sure User model is required here
const router = express.Router();

router.post("/register", limiter, register);
router.post("/login", limiter, login);
router.put("/profile", authMiddleware, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);

// Use the error handler
router.use(errorHandler);
router.use(authMiddleware); // Apply auth middleware to all routes below

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "This is a protected route", user });
  } catch (error) {
    console.error("Error retrieving user details:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to retrieve user details" });
  }
});

router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
