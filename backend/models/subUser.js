const mongoose = require("mongoose");

// Subuser Schema for subusers
const SubUserSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    default: "xxxxxxxxxx",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  // Password field will be set later after the subuser clicks the email link
  password: {
    type: String,
    required: false, // Not required when subuser is created
    select: false, // Don't include password in queries by default
  },
  role: { type: String, enum: ["admin", "editor"], required: true },
  parentUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Link to the main user (admin/editor)
    required: true, // Must have a parent user (admin/editor)
  },
  resetToken: {
    type: String,
    required: false, // Field to store the reset token for setting password
  },
});

const SubUser = mongoose.model("SubUser", SubUserSchema);

module.exports = SubUser;
