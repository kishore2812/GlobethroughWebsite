// controllers/subUserController.js
const subUserService = require("../services/subUserService");
const SubUser = require("../models/subUser");
const bcrypt = require("bcrypt");

async function createSubUser(req, res) {
  const { firstName, lastName, email, role } = req.body;
  const parentUserId = req.user.id; // This comes from the authenticated main user

  try {
    const subUser = await subUserService.createSubUser(
      parentUserId,
      firstName,
      lastName,
      email,
      role
    );
    res
      .status(201)
      .json({ message: "Sub user created successfully!", subUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to create subuser." });
  }
}

async function setPassword(req, res) {
  try {
    const { id } = req.params; // Get subuser ID from the URL
    const { password } = req.body; // Get the new password from the request body

    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find the subuser and update their password
    const updatedSubUser = await SubUser.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedSubUser) {
      return res.status(404).json({ error: "Subuser not found." });
    }

    res.status(200).json({ message: "Password set successfully." });
  } catch (error) {
    console.error("Error setting password:", error);
    res.status(500).json({ error: "Failed to set password." });
  }
}

async function getSubUserInfo(req, res) {
  try {
    const subUserId = req.user.id; // Assuming the token middleware adds `user` object to `req`
    const subUserInfo = await subUserService.getSubUserInfoById(subUserId);

    if (!subUserInfo) {
      return res.status(404).json({ message: "Sub-user not found" });
    }

    res.status(200).json(subUserInfo);
  } catch (error) {
    console.error("Error fetching sub-user info:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { createSubUser, setPassword, getSubUserInfo };
