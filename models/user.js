const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
