const express = require("express");
const router = express.Router();
const {
  createSubUser,
  getSubUsers,
  deleteSubUser,
  updateSubUserRole,
  getSubUserInfo,
} = require("../controllers/subuserController");
const authMiddleware = require("../middlewares/authMiddleware"); // Ensure admin authentication
const { subuserLogin } = require("../controllers/subuserLoginController");

// Route to create a subuser
router.post("/createSubUser", authMiddleware, createSubUser);

// Route for subuser login
router.post("/login", subuserLogin);

// Route to get subuser information (for the logged-in subuser)
router.get("/subuserinfo", authMiddleware, getSubUserInfo);

// Route to fetch all subusers associated with the logged-in parent user
router.get("/subusers", authMiddleware, getSubUsers);

// Route to delete a subuser by ID
router.delete("/subusers/delete/:userId", authMiddleware, deleteSubUser);

// Route to update the role of a subuser
router.put("/subusers/changeRole/:userId", authMiddleware, updateSubUserRole);

module.exports = router;
