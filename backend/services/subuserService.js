const User = require("../models/User");
const nodemailer = require("nodemailer");

exports.createSubUser = async (
  adminId,
  firstName,
  lastName,
  email,
  phone,
  role
) => {
  try {
    // Check if the email is already used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email is already in use.");
    }

    // Create a new subuser without a password (it will be set via email link)
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      role, // Admin selects role (admin/editor)
    });

    // Save the new subuser
    await newUser.save();

    // Find the admin user and add this subuser to their subusers list
    const adminUser = await User.findById(adminId);
    if (!adminUser) {
      throw new Error("Admin user not found.");
    }

    adminUser.subusers.push(newUser._id);
    await adminUser.save();

    // Send an invitation email with the password setup link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Create Your Password",
      text: `Hello ${firstName},\n\nYou have been invited to join as a ${role}. Please click on the following link to set your password and get started: \n\nhttp://yourdomain.com/set-password?email=${email}\n\nRegards,\nAdmin`,
    };

    await transporter.sendMail(mailOptions);

    return newUser; // Return the newly created user
  } catch (error) {
    throw new Error(error.message || "Error creating subuser.");
  }
};
