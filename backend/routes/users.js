const express = require("express");
const router = express.Router();
const User = require("./../db/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

// Sign Up
router.post("/sign-up", async (req, res) => {
  try {
    const { userName, email, password,roles } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).send({ message: "Email already registered" });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashPass ,roles});
    await newUser.save();

    const userData = newUser.toObject();
    delete userData.password;

    const token = jwt.sign({
      id: newUser._id,
      userId: newUser.userId,
      username: newUser.userName,
      roles: newUser.roles
    },
    SECRET_KEY,
    { expiresIn: "7d" }
  );

    res.status(201).send({ message: "User registered", user: userData, token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const userData = user.toObject();
    delete userData.password;

    const token = jwt.sign({ id: user._id,username:user.userName ,userId: user.userId,roles:user.roles}, SECRET_KEY, { expiresIn: "7d" });

    res.send({ message: "Login successful", user: userData, token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

//fetch Users
router.get("", async (req, res) => {
  const first = parseInt(req.query.first) || 0;
  const rows = parseInt(req.query.rows) || 10;
  try {
    const users = await User.find()
                              .skip(first)
                              .limit(rows)
                             .select("-password") // نحذف كلمة السر من النتائج
                              .exec();

    const totalRecords = await User.countDocuments();

    res.send({ users, totalRecords });
  } catch (err) {
    res.status(500).send({ error: "Something went wrong." });
  }
});

router.delete("/:userId", async (req, res) => {
  const userId = parseInt(req.params["userId"]);

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
router.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params["userId"]);

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
router.put("/:userId", async (req, res) => {
  const userId = parseInt(req.params["userId"]);
  const updatedData = req.body;

  try {
    if (updatedData.password) {
      const bcrypt = require("bcrypt");
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
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const resetToken = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    const resetUrl = `http://localhost:4200/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `<h2>Reset your password</h2>
             <p>Click the link below to reset your password:</p>
             <a href="${resetUrl}">Reset Password</a>`,
    });

    res.send({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.send({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: "Invalid or expired token" });
  }
});

module.exports = router;
