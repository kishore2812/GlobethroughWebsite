const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming you have a User model

// Service to create a new user
exports.createUser = async ({ firstName, lastName, email, password }) => {
  // Check if user already exists by email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  // Save user to database
  await user.save();

  return user; // Optionally, return the user object if needed
};

// Service to authenticate user (check email and password)
exports.authenticateUser = async ({ email, password }) => {
  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      userType: "user", // Add the userType (can be "user" or "subuser", or any other relevant type)
      firstName: user.firstName, // Add the user's firstName to the token
      lastName: user.lastName,
      phone: user.phone,
    },
    process.env.JWT_SECRET,
    { expiresIn: "10h" }
  );

  return token; // Return the generated JWT token
};

// Service to fetch user information by user ID
exports.getUserInfo = async (userId) => {
  // Find user by ID
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Return user data (excluding password)
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  };
};

// Service to update user information (optional, if needed)
exports.updateUser = async (userId, updateData) => {
  try {
    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // This will return the updated user document
      runValidators: true, // Ensure validation runs (optional)
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser; // Return the updated user object
  } catch (error) {
    throw new Error("Error updating user in database: " + error.message);
  }
};

// Service to delete a user (optional, if needed)
exports.deleteUser = async (userId) => {
  // Find user by ID and delete
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return { message: "User deleted successfully" };
};
