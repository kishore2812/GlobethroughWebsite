const express = require("express");
const { setPassword } = require("../controllers/subuserController");

const router = express.Router();

router.post("/set-password/:id", setPassword);

module.exports = router;
