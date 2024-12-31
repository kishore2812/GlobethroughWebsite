import React, { useState } from "react";
import axios from "axios";
import AccountHeader from "../../Components/Header/AccountHeader";
import { AiFillPlusSquare } from "react-icons/ai";
import "./AddSubUsersPage.scss";

const AddSubUsersPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "editor", // Default role
    phone: "", // Add phone field to state
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSubUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      await axios.post(
        "http://localhost:5000/subuser/createSubUser",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Sub user added successfully. Invitation sent!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "editor",
        phone: "", // Reset phone field after form submission
      });
    } catch (err) {
      console.error("Error adding sub user:", err);
      setError("Failed to add sub user.");
    }
  };

  return (
    <div>
      <AccountHeader />
      <div className="add-subusers-page">
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
        <form>
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter First Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter Last Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email Address"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required
            />
          </div>

          <div className="form-group">
            <label>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="select-role"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <button
            type="button"
            className="add-button"
            onClick={handleAddSubUser}
          >
            <span className="icon-container">
              <AiFillPlusSquare size={18} />{" "}
            </span>
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubUsersPage;
