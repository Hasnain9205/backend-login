const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");
dotenv.config();
const app = express();
app.use(express.json());

const isValidPhoneNumber = (number) => {
  const regex = /^01[3-9]\d{8}$/;
  return regex.test(number);
};

exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).send({ message: "Phone number is required." });
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).send({ message: "Invalid phone number format" });
    }
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Phone number already register" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 5 * 60000);

    let user = await User.findOneAndUpdate(
      { phoneNumber },
      { otp, otpExpiration, isVerified: false },
      { new: true, upsert: true }
    );

    if (!user) {
      return res
        .status(500)
        .json({ message: "Failed to create or update user" });
    }
    await user.save();

    res.status(200).json({ message: "OTP sent successfully", user });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user || user.otp !== otp || user.otpExpiration < Date.now()) {
      return res
        .status(400)
        .json({ message: "Invalid OTP or OTP has expired" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully", token });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};
