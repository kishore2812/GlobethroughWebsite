import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // For navigation and route detection
import { jwtDecode } from "jwt-decode"; // To decode JWT token
import { FaRegUserCircle, FaChevronRight, FaArrowLeft } from "react-icons/fa"; // For icons
import axios from "axios"; // To make API requests
import "./Header.scss";

interface DecodedToken {
  userType: string;
  role?: string;
}

const Header = () => {
  const [userType, setUserType] = useState<string>("");
  const [role, setRole] = useState<string | undefined>(undefined);
  const [firstName, setFirstName] = useState<string | undefined>(undefined);
  const [parentFirstName, setParentFirstName] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);

  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        setUserType(decodedToken.userType);
        setRole(decodedToken.role);

        const fetchUserData = async () => {
          try {
            let response;
            if (decodedToken.userType === "user") {
              response = await axios.get(
                "http://localhost:5000/api/user/info",
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setFirstName(response.data.firstName);
            } else if (decodedToken.userType === "subuser") {
              response = await axios.get(
                "http://localhost:5000/subuser/subuserinfo",
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setFirstName(response.data.firstName);
              setParentFirstName(response.data.parentFirstName);
            }
          } catch (error) {
            setError("Error fetching user data");
            console.error("Error fetching user data:", error);
          }
        };

        fetchUserData();
      } catch {
        setError("Error decoding token");
      }
    }
  }, []);

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <header className="header">
      {/* Logo or Back Button */}
      <div className="logo-back">
        {location.pathname === "/HomePage" ||
        location.pathname === "/homepage/" ? ( // Ensure we check both with and without trailing slash
          <img src="src/assets/images/logo.png" alt="Logo" />
        ) : (
          <span className="back-btn" onClick={handleBack}>
            <FaArrowLeft />
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="nav">
        <ul className="nav-links">
          <li>
            <a href="/homepage">Book Tickets</a>
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
            {userType === "subuser" && firstName && parentFirstName && role
              ? `Hello, ${firstName} (${role}) & Parent: ${parentFirstName}`
              : userType === "user" && firstName
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
