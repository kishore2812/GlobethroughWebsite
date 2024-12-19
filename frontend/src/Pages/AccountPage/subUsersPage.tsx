import React, { useEffect, useState } from "react";
import axios from "axios";

interface SubUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string; // Either "admin" or "editor"
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

        const response = await axios.get("http://localhost:5000/subuser/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSubUsers(response.data.subUsers);
      } catch (err) {
        console.error("Error fetching subusers:", err);
        setError("Failed to fetch subusers.");
      }
    };

    fetchSubUsers();
  }, []);

  return (
    <div className="see-subusers-page">
      <h1>Sub Users</h1>
      {error && <p className="error">{error}</p>}
      <ul>
        {subUsers.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.lastName} ({user.role}) - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeeSubUsersPage;
