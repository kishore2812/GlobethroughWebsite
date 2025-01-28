const express = require("express");
const { getAmadeusToken } = require("../controllers/amadeusTokenController");

const router = express.Router();

// Route to fetch the Amadeus token
router.get("/token", getAmadeusToken);

module.exports = router;
