const express = require("express");
const router = express.Router();
const { createSubUser } = require("../controllers/subuserController");
const authMiddleware = require("../middlewares/authMiddleware"); // Ensure admin authentication
const { subuserLogin } = require("../controllers/subuserLoginController");
const subUserController = require("../controllers/subuserController");

// Route to create a subuser
router.post("/createSubUser", authMiddleware, createSubUser);

router.post("/login", subuserLogin); // Route for subuser login
router.get("/subuserinfo", authMiddleware, subUserController.getSubUserInfo);
module.exports = router;
