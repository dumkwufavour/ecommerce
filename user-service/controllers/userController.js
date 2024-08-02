const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const validator = require("validator"); // Ensure validator is imported
const transporter = require("../utils/emailService"); // Import the transporter

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Create a new user with an email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = new User({
      username,
      email,
      password,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiry: Date.now() + 3600000, // 1 hour expiration
    });
    await user.save();

    // Create the verification URL
    const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    };

    // Send verification email
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User registered. Please check your email for verification.",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists and if password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(400).json({
        error:
          "Email not verified. Please check your email to verify your account.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Find the user and update their profile
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update fields if provided
    if (username) user.username = username;
    if (email) {
      // Validate email
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      user.email = email;
    }
    if (password) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save updated user
    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error sending email. Please try again later." });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error resetting password. Please try again later." });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      console.log("No user found with the provided token");
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }

    if (user.emailVerificationTokenExpiry < Date.now()) {
      console.log("Verification token has expired");
      return res.status(400).json({ error: "Verification token has expired" });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res
      .status(500)
      .json({ error: "Error verifying email. Please try again later." });
  }
};
