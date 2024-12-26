import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection in React Router v6+

const SubUserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigate instead of useHistory

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset any previous error

    try {
      const response = await axios.post("http://localhost:5000/subuser/login", {
        email,
        password,
      });
      // Store the token (and other data if needed) in localStorage or state
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("subuserFirstName", response.data.subuserFirstName);
      localStorage.setItem(
        "parentUserFirstName",
        response.data.parentUser.firstName
      );

      // Redirect to homepage after successful login
      navigate("/homepage"); // Using navigate to redirect
    } catch {
      setError("An error occurred during login");
    }
  };

  return (
    <div>
      <h2>Subuser Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SubUserLoginPage;
