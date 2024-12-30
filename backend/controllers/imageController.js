// controllers/userController.js
const User = require("../models/User");
const mongoose = require("mongoose");

// Controller for uploading the profile image as Base64
const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated token (assuming JWT authentication)
    const { profileImage } = req.body; // Base64 encoded image sent from frontend

    if (!profileImage) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    // Validate that the base64 string is a valid image
    if (!profileImage.startsWith("data:image/")) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    // Update user's profile image in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: profileImage },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: updatedUser.profileImage, // Send the updated image URL
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Controller to get user profile image
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Assuming user authentication

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Send the profile image or a default image path (if not set)
    res.json({ profileImage: user.profileImage || null });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getUserProfile,
  updateProfileImage,
};
