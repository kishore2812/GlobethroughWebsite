// controllers/subUserController.js
const subUserService = require("../services/subUserService");
const SubUser = require("../models/subUser");
const bcrypt = require("bcrypt");

async function createSubUser(req, res) {
  const { firstName, lastName, email, role, phone } = req.body;
  const parentUserId = req.user.id; // This comes from the authenticated main user

  try {
    const subUser = await subUserService.createSubUser(
      parentUserId,
      firstName,
      lastName,
      email,
      role,
      phone
    );
    res.status(201).json({
      message: "Sub user added successfully. Invitation sent!",
      subUser,
    });
  } catch (err) {
    console.error("Error in controller:", err); // Log the error
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

// Controller method to fetch subusers for the logged-in parent user
async function getSubUsers(req, res) {
  try {
    const parentUserId = req.user.id; // This comes from the authenticated main user

    // Find all subusers that have the same parentUserId
    const subUsers = await SubUser.find({ parentUser: parentUserId });

    if (!subUsers || subUsers.length === 0) {
      return res
        .status(404)
        .json({ message: "No subusers found for this parent user." });
    }

    res.status(200).json({ subUsers });
  } catch (error) {
    console.error("Error fetching subusers:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
// Controller method to delete a subuser
async function deleteSubUser(req, res) {
  const { userId } = req.params; // Get subuser ID from the URL

  if (!userId) {
    return res.status(400).json({ error: "Subuser ID is required." });
  }

  try {
    // Find the subuser by ID and ensure that the parentUser matches the logged-in user's ID
    const deletedSubUser = await SubUser.findOneAndDelete({
      _id: userId,
      parentUser: req.user.id, // Ensure the logged-in user is the parent
    });

    if (!deletedSubUser) {
      console.log("Subuser not found or not authorized to delete.");
      return res.status(404).json({
        error: "Subuser not found or you don't have permission to delete.",
      });
    }

    res
      .status(200)
      .json({ message: "Subuser deleted successfully.", deletedSubUser });
  } catch (error) {
    console.error("Error deleting subuser:", error);
    res.status(500).json({ error: "Failed to delete subuser." });
  }
}

// Controller method to update the role of a subuser
async function updateSubUserRole(req, res) {
  const { userId } = req.params; // Get the subuser ID from the URL
  const { role } = req.body; // Get the new role from the request body

  if (!userId || !role) {
    return res.status(400).json({ error: "Subuser ID and role are required." });
  }

  try {
    // Find the subuser by ID and ensure that the parentUser matches the logged-in user's ID
    const updatedSubUser = await SubUser.findOneAndUpdate(
      { _id: userId, parentUser: req.user.id }, // Ensure the parentUser matches the logged-in user's ID
      { role: role },
      { new: true } // Return the updated subuser document
    );

    if (!updatedSubUser) {
      return res.status(404).json({
        error: "Subuser not found or you don't have permission to update.",
      });
    }

    res
      .status(200)
      .json({ message: "Role updated successfully.", updatedSubUser });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Failed to update role." });
  }
}

module.exports = {
  createSubUser,
  setPassword,
  getSubUserInfo,
  getSubUsers,
  deleteSubUser,
  updateSubUserRole,
};
