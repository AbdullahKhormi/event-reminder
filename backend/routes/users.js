const express = require("express");
const router = express.Router();
const User = require("./../db/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

// Sign Up
router.post("/sign-up", async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).send({ message: "Email already registered" });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashPass });
    await newUser.save();

    const userData = newUser.toObject();
    delete userData.password;

    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: "7d" });

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

    const token = jwt.sign({ id: user._id,username:user.userName }, SECRET_KEY, { expiresIn: "7d" });

    res.send({ message: "Login successful", user: userData, token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
