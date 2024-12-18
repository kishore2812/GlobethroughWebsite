const UserService = require("../services/userService"); // Import the service layer

// Register Controller
const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    // Call createUser from the service layer
    await UserService.createUser({ firstName, lastName, email, password });
    res.status(201).json({ message: "User registered successfully!" });
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
    // Call authenticateUser from the service layer
    const token = await UserService.authenticateUser({ email, password });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { signIn, register };
