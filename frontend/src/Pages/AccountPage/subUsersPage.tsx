import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMinusSquare } from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
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
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isRoleActive, setIsRoleActive] = useState<boolean>(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

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
        console.error("Error fetching subusers", err);
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

      await axios.delete(
        `http://localhost:5000/subuser/subusers/delete/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

      if (newRole !== "admin" && newRole !== "editor") {
        setError("Invalid role. Please select either 'admin' or 'editor'.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/subuser/subusers/changeRole/${userId}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);
      setSubUsers(
        subUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      setEditingUserId(null); // Exit edit mode after updating the role
      setIsRoleActive(false); // Close role selection cards
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

        <h2 className="members-heading">Members</h2>
        <ul className="subuser-list">
          {subUsers.map((user) => (
            <li className="subuser-item" key={user._id}>
              <div className="subuser-details">
                <span className="subuser-name">
                  {user.firstName} {user.lastName}{" "}
                  <span className="role">({user.role})</span>
                </span>
              </div>
              <div className="actions">
                <div className="remove-container">
                  <button
                    className="delete-btn"
                    onClick={() => deleteSubUser(user._id)}
                  >
                    <FaMinusSquare className="icon-remove" /> Remove
                  </button>
                </div>

                <div className="change-role-container">
                  {editingUserId === user._id ? (
                    <button
                      className="edit-role-btn"
                      onClick={() => {
                        setIsRoleActive(!isRoleActive);
                        setActiveUserId(user._id);
                      }}
                    >
                      <MdEditSquare className="icon-edit" /> Change Role
                    </button>
                  ) : (
                    <button
                      className="edit-role-btn"
                      onClick={() => setEditingUserId(user._id)}
                    >
                      <MdEditSquare className="icon-edit" /> Change Role
                    </button>
                  )}

                  {/* Role cards inside the Change Role button */}
                  {isRoleActive && activeUserId === user._id && (
                    <div className="role-selection">
                      <div
                        className="role-card"
                        onClick={() => {
                          changeRole(user._id, "admin");
                        }}
                      >
                        Admin
                      </div>
                      <div
                        className="role-card"
                        onClick={() => {
                          changeRole(user._id, "editor");
                        }}
                      >
                        Editor
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SeeSubUsersPage;
