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
    phone: "",
    role: "editor", // Default role
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone } = formData;

    if (!firstName || !lastName || !email || !phone) {
      return "Please fill in all required fields.";
    }

    // Simple email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    // Simple phone validation (you can customize this based on your needs)
    const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number
    if (!phoneRegex.test(phone)) {
      return "Please enter a valid phone number.";
    }

    // Check if email is already in use (example logic)
    if (formData.email === "already@taken.com") {
      return "This email is already taken. Please use a different one.";
    }

    // Check if phone is already in use (example logic)
    if (formData.phone === "1234567890") {
      return "This phone number is already taken. Please use a different one.";
    }

    return null; // Return null if everything is valid
  };

  const handleAddSubUser = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      // Simulate adding the sub-user (no email/phone validation from the DB)
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
        phone: "",
        role: "editor", // Reset to default
      });
      setError(null); // Clear any previous errors
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
