import React, { useEffect, useState } from "react";
import { FaChevronRight, FaRegUserCircle } from "react-icons/fa"; // Importing the user icon
import axios from "axios"; // Using axios for HTTP requests
import "./Header.scss";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null); // Store first name
  const [error, setError] = useState<string | null>(null); // Handle errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token"); // Get JWT token from localStorage

      if (!token) {
        setError("User not authenticated.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/info",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
          }
        );

        // Assuming response contains user info such as firstName
        setFirstName(response.data.firstName);
      } catch {
        setError("Failed to fetch user info. Please log in.");
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <header className="header">
      {/* Logo Section */}
      <div className="logo">
        <img src="src/assets/images/logo.png" alt="Logo" />
      </div>

      {/* Navigation Links */}
      <nav className="nav">
        <ul className="nav-links">
          <li>
            <a href="/book-tickets">Book Tickets</a>
          </li>
          <li>
            <a href="/incentives">Incentives</a>
          </li>
          <li>
            <a href="/withdraw">Withdraw</a>
          </li>
          <li>
            <a href="/history">History</a>
          </li>
        </ul>

        {/* Account Info Button */}

        <button className="account-btn" onClick={() => navigate("/account")}>
          <FaRegUserCircle className="icon" />
          <span className="text">
            {firstName ? `Hello, ${firstName}` : error || "Loading..."}
          </span>
          <FaChevronRight className="chevron-icon" />
        </button>
      </nav>
    </header>
  );
};

export default Header;
