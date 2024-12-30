import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaSave, FaUsers, FaUserPlus } from "react-icons/fa";
import AccountHeader from "../../Components/Header/AccountHeader";
import "./AccountPage.scss";

interface DecodedToken {
  userType: string;
}

const AccountPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    email: "",
    phone: "xxxxxxxxxx",
  });
  const [newFirstName, setNewFirstName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Decode the token to get user type
        const decoded: DecodedToken = jwtDecode(token);
        const userType = decoded.userType;

        // Determine the endpoint based on userType
        const endpoint =
          userType === "user"
            ? "http://localhost:5000/api/user/info"
            : "http://localhost:5000/api/subuser/info";

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update user information
        setUserInfo({
          firstName: response.data.firstName,
          email: response.data.email,
          phone: response.data.phone || "xxxxxxxxxx",
        });
      } catch (err) {
        console.error("Error fetching details:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleFirstNameUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded: DecodedToken = jwtDecode(token);
      const userType = decoded.userType;

      const endpoint =
        userType === "user"
          ? "http://localhost:5000/api/user/update"
          : "http://localhost:5000/api/subuser/update";

      const response = await axios.put(
        endpoint,
        { firstName: newFirstName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserInfo((prev) => ({
        ...prev,
        firstName: response.data.user.firstName,
      }));
      setIsEditingFirstName(false);
    } catch (err) {
      console.error("Error updating first name:", err);
    }
  };

  const handlePhoneUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded: DecodedToken = jwtDecode(token);
      const userType = decoded.userType;

      const endpoint =
        userType === "user"
          ? "http://localhost:5000/api/user/update"
          : "http://localhost:5000/api/subuser/update";

      const response = await axios.put(
        endpoint,
        { phone: newPhone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserInfo((prev) => ({ ...prev, phone: response.data.user.phone }));
      setIsEditingPhone(false);
    } catch (err) {
      console.error("Error updating phone:", err);
    }
  };

  const handleSeeSubUsers = () => navigate("/sub-users");
  const handleAddSubUser = () => navigate("/add-sub-user");

  return (
    <div className="accountpage">
      <AccountHeader />
      <div className="accountpage-card">
        <div className="accountpage-info-item">
          <div className="accountpage-left-col">
            <strong>First Name:</strong>
            {isEditingFirstName ? (
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                placeholder="Enter new first name"
                autoFocus
              />
            ) : (
              <span>{userInfo.firstName}</span>
            )}
          </div>
          <div className="accountpage-right-col">
            <button
              className={isEditingFirstName ? "save-btn" : "edit-btn"}
              onClick={() => {
                if (isEditingFirstName) handleFirstNameUpdate();
                else {
                  setIsEditingFirstName(true);
                  setNewFirstName(userInfo.firstName);
                }
              }}
            >
              {isEditingFirstName ? <FaSave /> : <FaEdit />}
              {isEditingFirstName ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        <div className="accountpage-info-item">
          <div className="accountpage-left-col">
            <strong>Phone:</strong>
            {isEditingPhone ? (
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Enter new phone"
                autoFocus
              />
            ) : (
              <span>{userInfo.phone}</span>
            )}
          </div>
          <div className="accountpage-right-col">
            <button
              className={isEditingPhone ? "save-btn" : "edit-btn"}
              onClick={() => {
                if (isEditingPhone) handlePhoneUpdate();
                else {
                  setIsEditingPhone(true);
                  setNewPhone(userInfo.phone);
                }
              }}
            >
              {isEditingPhone ? <FaSave /> : <FaEdit />}
              {isEditingPhone ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        <div className="accountpage-info-item">
          <div className="accountpage-left-col">
            <strong>Email:</strong>
            <span>{userInfo.email}</span>
          </div>
        </div>

        <div className="accountpage-info-item">
          <div className="accountpage-left-col">
            <strong>Members:</strong>
            <span>Edit members</span>
          </div>
          <div className="accountpage-right-col members-btn-row">
            <button className="members-btn" onClick={handleSeeSubUsers}>
              <FaUsers /> Members
            </button>
            <button className="members-btn" onClick={handleAddSubUser}>
              <FaUserPlus /> Add Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
