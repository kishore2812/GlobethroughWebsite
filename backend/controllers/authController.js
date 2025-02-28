const UserService = require("../services/userService"); // Import the service layer

// Register Controller
const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    // Call createUser from the service layer with 'approved' set to false
    await UserService.createUser({
      firstName,
      lastName,
      email,
      password,
      approved: false,
    });

    res.status(201).json({
      message: "User registered successfully! Awaiting admin approval.",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user!", error: err.message });
  }
};

// Sign-In Controller
const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await UserService.findUserByEmail(email);

    // Verify password
    await UserService.verifyPassword(user, password);

    // Check if the user is approved
    if (!user.approved) {
      return res
        .status(403)
        .json({ message: "Your account is awaiting admin approval." });
    }

    // Authenticate the user and generate token
    const token = await UserService.authenticateUser({ email, password });

    res.json({ token });
  } catch (error) {
    // Check if error is a known user/password issue and return correct status
    if (error.message === "User not found") {
      return res.status(400).json({ message: "User not found." });
    } else if (error.message === "Invalid password") {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Default error for unexpected issues
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
};

module.exports = { signIn, register };
