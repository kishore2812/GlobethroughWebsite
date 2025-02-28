const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: { type: String, default: "xxxxxxxxxx" },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  profileImage: { type: String, default: null },
  password: {
    type: String,
    required: true,
  },
  approved: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
