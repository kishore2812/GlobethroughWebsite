const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.setPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "Password has been set successfully. You can now log in.",
    });
  } catch (err) {
    console.error("Error setting password:", err);
    res.status(500).json({ message: "Failed to set password." });
  }
};
