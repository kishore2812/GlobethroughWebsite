const UserService = require("../services/userService");

exports.createSubUser = async (req, res) => {
  const { firstName, lastName, email, phone, role } = req.body;

  try {
    // Assume req.user.id contains the admin's user ID (sent via JWT)
    const adminId = req.user.id;

    // Call the service layer to create the subuser
    const newUser = await UserService.createSubUser(
      adminId,
      firstName,
      lastName,
      email,
      phone,
      role
    );

    // Respond with success
    res.status(201).json({
      message:
        "Subuser created successfully. An email has been sent to set up their password.",
      user: newUser,
    });
  } catch (err) {
    console.error("Error creating subuser:", err);
    res
      .status(500)
      .json({ message: err.message || "Failed to create subuser." });
  }
};
