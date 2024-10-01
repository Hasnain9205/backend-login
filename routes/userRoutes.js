const express = require("express");
const { sendOTP, verifyOTP } = require("../Controller/userController");
const router = express.Router();

router.post("/login/otp", sendOTP);
router.post("/login/verify", verifyOTP);

module.exports = router;
