import React, { useEffect, useState } from "react";
import { FaChevronRight, FaRegUserCircle } from "react-icons/fa"; // Importing the user icon
import axios from "axios"; // Using axios for HTTP requests
import { useNavigate } from "react-router-dom"; // Importing react-router's useNavigate
import "./Header.scss";

const Header: React.FC = () => {
  const [firstName, setFirstName] = useState<string | null>(null); // Store first name
  const [parentFirstName, setParentFirstName] = useState<string | null>(null); // Store parent's first name
  const [userType, setUserType] = useState<string | null>(null); // Store user type (subuser or user)
  const [error, setError] = useState<string | null>(null); // Handle errors
  const navigate = useNavigate(); // Use navigate hook for navigation

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token"); // Get JWT token from localStorage

      if (!token) {
        setError("User not authenticated.");
        return;
      }

      try {
        // Make an API call to get user info
        const response = await axios.get(
          "http://localhost:5000/api/user/info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Log the entire response to see what is being returned
        console.log("Response from API: ", response.data);

        // Assuming response contains subuserFirstName and parentUserFirstName
        setFirstName(response.data.subuserFirstName || response.data.firstName);
        setParentFirstName(response.data.parentUserFirstName || null);
        setUserType(response.data.userType); // Log this to verify it's being returned
      } catch (error) {
        console.error("Error fetching user info:", error);
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
            {userType === "subuser" && parentFirstName
              ? `Hello, ${parentFirstName} (Parent) & ${firstName} (Subuser)`
              : firstName
              ? `Hello, ${firstName}`
              : error || "Loading..."}
          </span>
          <FaChevronRight className="chevron-icon" />
        </button>
      </nav>
    </header>
  );
};

export default Header;
