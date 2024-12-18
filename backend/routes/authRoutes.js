const express = require("express");
const { signIn, register } = require("../controllers/authController");

const router = express.Router();

router.post("/signin", signIn);
router.post("/register", register);

module.exports = router;
