import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { jwtDecode } from "jwt-decode"; // To decode JWT token
import { FaRegUserCircle, FaChevronRight } from "react-icons/fa"; // For icons
import "./Header.scss";

// Define the expected structure of the decoded token
interface DecodedToken {
  userType: string;
  firstName?: string;
  subuserFirstName?: string;
  parentUserFirstName?: string;
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token to extract data
        const decodedToken: DecodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        setUserType(decodedToken.userType);

        // Based on userType, set the firstName, parentFirstName, and role
        if (decodedToken.userType === "subuser") {
          setFirstName(decodedToken.subuserFirstName);
          setParentFirstName(decodedToken.parentUserFirstName); // For subuser, set parent's firstName
          setRole(decodedToken.role);
        } else if (decodedToken.userType === "user") {
          setFirstName(decodedToken.firstName); // For user, set the user's firstName
          setRole(decodedToken.role);
        }
      } catch {
        setError("Error decoding token");
      }
    }
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
            {userType === "subuser" && parentFirstName && firstName && role
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
