const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SubUser = require("../models/subUser");

exports.subuserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email); // Log the email being verified

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find subuser by email and populate parentUser
    const subuser = await SubUser.findOne({ email })
      .populate("parentUser")
      .select("password firstName parentUser");

    if (!subuser) {
      console.log("No subuser found for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("Subuser found:", subuser); // Log the subuser details

    // Ensure the password exists for the subuser
    if (!subuser.password || subuser.password === "") {
      console.log("Password not set for subuser:", subuser.firstName);
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

    console.log("Password verified for subuser:", subuser.firstName);

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: subuser._id,
        email: subuser.email,
        userType: "subuser",
        parentUser: subuser.parentUser,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    console.log("Generated token for subuser:", subuser.firstName);

    res.status(200).json({
      message: "Subuser login successful",
      token,
      userType: "subuser", // Send userType as subuser
      parentUser: subuser.parentUser?.firstName || "No Parent", // Include parent user first name if available
      subuserFirstName: subuser.firstName,
    });
  } catch (error) {
    console.error("Error during subuser login:", error);
    res.status(500).json({
      message: "An error occurred during sign in",
      error: error.message,
    });
  }
};
