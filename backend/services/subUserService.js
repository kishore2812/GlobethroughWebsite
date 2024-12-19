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

async function createSubUser(parentUserId, firstName, lastName, email, role) {
  try {
    console.log("Creating subuser with details:", {
      parentUserId,
      firstName,
      lastName,
      email,
      role,
    });

    const subUser = new SubUser({
      firstName,
      lastName,
      email,
      role,
      parentUser: parentUserId,
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
    throw error;
  }
}

module.exports = { createSubUser };
