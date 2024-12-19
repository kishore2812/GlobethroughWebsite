import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AccountPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    email: "",
    phone: "xxxxxxxxxx", // Default value for phone if empty
  });
  const [newFirstName, setNewFirstName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch user information on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/user/info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // If phone is empty, set it to "xxxxxxxxxx"
        setUserInfo({
          firstName: response.data.firstName,
          email: response.data.email,
          phone: response.data.phone || "xxxxxxxxxx", // Default to "xxxxxxxxxx" if no phone
        });
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Error fetching details");
      }
    };

    fetchUserInfo();
  }, []);

  // Handle first name update
  const handleFirstNameUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/user/update",
        { firstName: newFirstName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserInfo((prev) => ({
        ...prev,
        firstName: response.data.user.firstName,
      }));
      setMessage("First name updated successfully.");
      setNewFirstName("");
      setIsEditingFirstName(false);
    } catch (err) {
      console.error("Error updating first name:", err);
      setError("Failed to update first name.");
    }
  };

  // Handle phone number update
  const handlePhoneUpdate = async () => {
    if (!newPhone || newPhone === "xxxxxxxxxx") {
      setError("Please provide a valid phone number.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/api/user/update",
        { phone: newPhone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserInfo((prev) => ({
        ...prev,
        phone: response.data.user.phone,
      }));
      setMessage("Phone number updated successfully.");
      setNewPhone("");
      setIsEditingPhone(false);
    } catch (err) {
      console.error("Error updating phone number:", err);
      setError("Failed to update phone number.");
    }
  };

  const handleSeeSubUsers = () => {
    navigate("/sub-users");
  };

  const handleAddSubUser = () => {
    navigate("/add-sub-user");
  };

  return (
    <div className="account-page">
      <h1>Account Information</h1>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      <div className="info">
        <div className="info-item">
          <strong>First Name:</strong>
          {isEditingFirstName ? (
            <div>
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                placeholder="Enter new first name"
              />
              <button onClick={handleFirstNameUpdate}>Save</button>
              <button onClick={() => setIsEditingFirstName(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <span>
              {userInfo.firstName}
              <button onClick={() => setIsEditingFirstName(true)}>Edit</button>
            </span>
          )}
        </div>

        <div className="info-item">
          <strong>Phone:</strong>
          {isEditingPhone ? (
            <div>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Enter new phone number"
              />
              <button onClick={handlePhoneUpdate}>Save</button>
              <button onClick={() => setIsEditingPhone(false)}>Cancel</button>
            </div>
          ) : (
            <span>
              {userInfo.phone}
              <button onClick={() => setIsEditingPhone(true)}>Edit</button>
            </span>
          )}
        </div>

        <div className="info-item">
          <strong>Email:</strong> {userInfo.email}
        </div>
      </div>
      <div>
        <button onClick={handleSeeSubUsers}>See Sub-Users</button>
        <button onClick={handleAddSubUser}>Add Sub-User</button>
      </div>
    </div>
  );
};

export default AccountPage;
