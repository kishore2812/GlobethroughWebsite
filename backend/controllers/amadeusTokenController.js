const axios = require("axios");

let cachedToken = null; // Cache the token
let tokenExpiry = 0; // Cache the token expiry time

// Fetch token from Amadeus API
const getAmadeusToken = async (req, res) => {
  if (cachedToken && Date.now() < tokenExpiry) {
    return res.json({ access_token: cachedToken });
  }

  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;

    res.json({ access_token: cachedToken });
  } catch (error) {
    console.error(
      "Failed to fetch token:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch token" });
  }
};

module.exports = { getAmadeusToken };
