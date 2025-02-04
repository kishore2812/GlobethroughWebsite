const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware"); // Import the JWT auth middleware
const {
  getUserInformation,
  updateUserDetails,
} = require("../controllers/userController"); // Controller to fetch user info

const router = express.Router();

// Protected route to fetch user info (only accessible with a valid JWT token)
router.get("/user/info", authMiddleware, getUserInformation);
router.put("/user/update", authMiddleware, updateUserDetails);

module.exports = router;
