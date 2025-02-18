import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SetPassword.scss";

const SetPasswordModal = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id } = useParams(); // Get subuser ID from the URL
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/setpassword/set-password/${id}`,
        { password }
      );
      setSuccess(response.data.message);
      setError("");
      setTimeout(() => navigate("/signin/:role"), 2000); // Redirect after 2 seconds
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to set password.");
      } else if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred.");
      } else {
        setError("An unknown error occurred.");
      }
      setSuccess("");
    }
  };

  return (
    <div className="subusersetpassword-overlay">
      <div className="subusersetpassword-modal">
        <h1>Set Your Password</h1>
        <form className="subusersetpassword-form" onSubmit={handleSubmit}>
          <label>
            New Password:
            <input
              type="password"
              className="subusersetpassword-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="subusersetpassword-button">
            Set Password
          </button>
        </form>
        {error && <p className="subusersetpassword-message error">{error}</p>}
        {success && (
          <p className="subusersetpassword-message success">{success}</p>
        )}
      </div>
    </div>
  );
};

export default SetPasswordModal;
