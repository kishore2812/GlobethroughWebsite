const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SubUser = require("../models/subUser");

exports.subuserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find subuser by email and populate parentUser
    const subuser = await SubUser.findOne({ email })
      .populate("parentUser")
      .select("password firstName parentUser role");

    if (!subuser) {
      console.log("No subuser found for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Ensure the password exists for the subuser
    if (!subuser.password || subuser.password === "") {
      return res.status(400).json({
        message: "Please set your password before logging in",
        resetPasswordLink: `${process.env.FRONTEND_URL}/set-password/${subuser._id}`,
      });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, subuser.password);

    if (!isMatch) {
      console.log("Invalid password attempt for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: subuser._id,
        email: subuser.email,
        role: subuser.role,
        userType: "subuser", // Indicate subuser type
        subuserFirstName: subuser.firstName, // Add subuser's firstName
        parentUserFirstName: subuser.parentUser.firstName, // Add parent's firstName
      },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.status(200).json({
      message: "Subuser login successful",
      token,
      userType: "subuser", // Send userType as subuser
    });
  } catch (error) {
    console.error("Error during subuser login:", error);
    res.status(500).json({
      message: "An error occurred during sign in",
      error: error.message,
    });
  }
};
