const express = require("express");
const router = express.Router();
const User = require("../../database/users/userData");
const bcrypt = require("bcryptjs");
const generateToken = require("../../authentication/generateToken");
const { registerSchema, loginSchema } = require("../../validation/userSchema");
const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/authUser");

//! Get User
router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error });
  }
});

//! Register User
router.post("/register/newUser", validate(registerSchema), async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(409).json({ msg: "Email already exist" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashPassword,
    });
    await user.save();
    const token = await generateToken(user);
    return res.status(201).json({ msg: "Register successfully", user, token });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error });
  }
});

//! Login User
router.post("/Login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Email does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }
    const token = await generateToken(user);
    return res.status(200).json({ msg: "Login successfully", user, token });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error });
  }
});

//! Get User
router.get("/getUser", authenticate, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error });
  }
});

module.exports = router;
