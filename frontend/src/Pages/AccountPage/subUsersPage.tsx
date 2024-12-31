import React, { useEffect, useState } from "react";
import axios from "axios";
import AccountHeader from "../../Components/Header/AccountHeader";
import "./subUsersPage.scss";

interface SubUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  parentUser: string;
  phone: string;
}

const SeeSubUsersPage: React.FC = () => {
  const [subUsers, setSubUsers] = useState<SubUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/subuser/subusers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.subUsers && response.data.subUsers.length > 0) {
          setSubUsers(response.data.subUsers);
        } else {
          setError("No subusers found.");
        }
      } catch (err) {
        console.error("Error fetching subusers:", err);
        setError("Failed to fetch subusers.");
      }
    };

    fetchSubUsers();
  }, []);

  const deleteSubUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      // Send the request to delete the subuser
      await axios.delete(
        `http://localhost:5000/subuser/subusers/delete/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the subUser state to reflect the deletion
      setSubUsers(subUsers.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error deleting subuser:", err);
      setError("Failed to delete subuser.");
    }
  };

  const changeRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      // Validate role before sending
      if (newRole !== "admin" && newRole !== "editor") {
        setError("Invalid role. Please select either 'admin' or 'editor'.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/subuser/subusers/changeRole/${userId}`, // Ensure the userId is passed here
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);
      // Update the subUser in state
      setSubUsers(
        subUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error("Error changing role:", err);
      setError("Failed to change role.");
    }
  };

  return (
    <div className="subusers-background">
      <AccountHeader />
      <div className="see-subusers-page">
        {error && <p className="error">{error}</p>}

        <ul className="subuser-list">
          <h2 className="members-heading">Members</h2>
          {subUsers.map((user) => (
            <li className="subuser-item" key={user._id}>
              <div className="subuser-details">
                <span className="subuser-name">
                  {user.firstName} {user.lastName}{" "}
                  <span className="role">({user.role})</span>
                </span>
              </div>
              <div className="actions">
                <button
                  className="delete-btn"
                  onClick={() => deleteSubUser(user._id)}
                >
                  Remove
                </button>
                <select
                  className="role-select"
                  value={user.role}
                  onChange={(e) => changeRole(user._id, e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SeeSubUsersPage;
