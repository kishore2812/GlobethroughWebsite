// services/subUserService.js
const SubUser = require("../models/subUser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., "gmail"
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendInvitationEmail(to, link) {
  try {
    const info = await transporter.sendMail({
      from: `"Globethrough" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Set Your Password",
      text: `You have been invited. Click here to set your password: ${link}`,
      html: `<p>You have been invited. Click <a href="${link}">here</a> to set your password.</p>`,
    });

    return true;
  } catch (error) {
    return false;
  }
}

async function createSubUser(
  parentUserId,
  firstName,
  lastName,
  email,
  role,
  phone
) {
  try {
    const subUser = new SubUser({
      firstName,
      lastName,
      email,
      role,
      parentUser: parentUserId,
      phone, // Add phone here
    });

    const savedSubUser = await subUser.save();

    // Generate reset password link
    const resetLink = `${process.env.FRONTEND_URL}/set-password/${savedSubUser._id}`;

    // Send the invitation email
    const emailSent = await sendInvitationEmail(email, resetLink);
    if (!emailSent) {
      throw new Error("Email sending failed.");
    }

    return savedSubUser;
  } catch (error) {
    console.error("Error creating subuser:", error.message); // Log the specific error
    throw error;
  }
}

async function getSubUserInfoById(id) {
  try {
    // Fetch subuser details along with parent user's first name
    const subUser = await SubUser.findById(id)
      .select("firstName lastName email phone parentUser") // Include parentUser reference
      .populate("parentUser", "firstName"); // Populate the parent's firstName field

    if (!subUser) {
      throw new Error("SubUser not found");
    }

    // Include parentFirstName in the result
    const parentFirstName = subUser.parentUser
      ? subUser.parentUser.firstName
      : "";

    return {
      firstName: subUser.firstName,
      lastName: subUser.lastName,
      email: subUser.email,
      phone: subUser.phone,
      parentFirstName, // Add parentFirstName to the response
    };
  } catch (error) {
    console.error("Error in SubUserService", error);
    throw error;
  }
}

module.exports = { createSubUser, getSubUserInfoById };
