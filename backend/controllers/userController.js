const { getUserInfo } = require("../services/userService");
const UserService = require("../services/userService");

// Controller to fetch user info
exports.getUserInformation = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware
    const userInfo = await getUserInfo(userId);
    res.json(userInfo); // Send the user data as response
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUserDetails = async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is passed via JWT in the `req.user` object
  const { firstName, phone } = req.body;

  try {
    // Prepare the update data
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (phone) updateData.phone = phone;

    // If no fields to update, return an error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    // Call the service layer to update the user
    const updatedUser = await UserService.updateUser(userId, updateData);

    // Send success response
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: error.message });
  }
};
