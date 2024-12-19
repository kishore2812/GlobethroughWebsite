const express = require("express");
const router = express.Router();
const { createSubUser } = require("../controllers/subuserController");
const authMiddleware = require("../middlewares/authMiddleware"); // Ensure admin authentication

// Route to create a subuser
router.post("/createSubUser", authMiddleware, createSubUser);

module.exports = router;
