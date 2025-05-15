const express = require("express");
const router = express.Router();
const User = require("../db/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const SECRET_KEY = process.env.JWT_SECRET;

// Set up the email transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Sign-up Route
router.post("/sign-up", async (req, res) => {
  try {
    const { userName, email, password, roles } = req.body;

    // Check if the email is already registered
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).send({ message: "Email already registered" });
    }

    // Hash the password and create new user
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashPass, roles });
    await newUser.save();

    // Remove password before sending user data
    const userData = newUser.toObject();
    delete userData.password;

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        userId: newUser.userId,
        username: newUser.userName,
        roles: newUser.roles,
      },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(201).send({ message: "User registered", user: userData, token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Remove password before sending user data
    const userData = user.toObject();
    delete userData.password;

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.userName,
        userId: user.userId,
        roles: user.roles,
      },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.send({ message: "Login successful", user: userData, token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Forgot Password Route: Send OTP
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Generate OTP and expiration time
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

    // Save OTP and expiration time to user
    user.otp = otp;
    user.otpExpires = otpExpires;
    user.otpVerified = false;
    await user.save();

    // Send OTP via email
   await transporter.sendMail({
  to: user.email,
  subject: "Your Password Reset OTP",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p style="font-size: 16px; color: #555;">
        You requested to reset your password. Use the OTP below to proceed:
      </p>
      <div style="font-size: 28px; font-weight: bold; text-align: center; color: #333; background-color: #e0f7fa; border: 2px dashed #26a69a; padding: 16px; border-radius: 6px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #888;">
        This code is valid for 3 minutes. If you did not request a password reset, please ignore this email.
      </p>
    </div>
  `,
});

    res.send({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Verify OTP Route
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).send({ message: "Invalid or expired OTP" });
    }

    user.otpVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.send({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Reset Password Route: After OTP verification
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    console.log("otpVerified:", user?.otpVerified);

    if (!user || !user.otpVerified) {
      return res.status(400).send({ message: "OTP not verified" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otpVerified = false;
    await user.save();

    res.send({ message: "Password has been reset successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get all users
router.get("", async (req, res) => {
  const first = parseInt(req.query.first) || 0;
  const rows = parseInt(req.query.rows) || 10;

  try {
    const users = await User.find()
      .skip(first)
      .limit(rows)
      .select("-password")
      .exec();

    const totalRecords = await User.countDocuments();

    res.send({ users, totalRecords });
  } catch (err) {
    res.status(500).send({ error: "Something went wrong." });
  }
});

// Delete User
router.delete("/:userId", async (req, res) => {
  const userId = parseInt(req.params["userId"]);
  if (isNaN(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    await User.deleteOne({ userId });
    res.send({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get specific user by ID
router.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params["userId"]);
  if (isNaN(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findOne({ userId }).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(user.toObject());
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Update User
router.put("/:userId", async (req, res) => {
  const userId = parseInt(req.params["userId"]);
  if (isNaN(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  const updatedData = req.body;

  try {
    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    const user = await User.findOneAndUpdate(
      { userId },
      updatedData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
