import React, { useState } from "react";
import axios from "axios";

const AddSubUsersPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
      setFormData({ firstName: "", lastName: "", email: "", role: "editor" });
    } catch (err) {
      console.error("Error adding sub user:", err);
      setError("Failed to add sub user.");
    }
  };

  return (
    <div className="add-subusers-page">
      <h1>Add Sub User</h1>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
      <form>
        <div>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Role:
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </label>
        </div>
        <button type="button" onClick={handleAddSubUser}>
          Add Sub User
        </button>
      </form>
    </div>
  );
};

export default AddSubUsersPage;
