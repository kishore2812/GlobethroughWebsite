import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelection.scss"; // Global import

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: "agent" | "company"): void => {
    navigate(`/signin/${role}`);
  };

  return (
    <div className="role-selection-container">
      {/* Top Section */}
      <div className="top-section">
        <img src="/src/assets/images/logo.png" alt="Logo" className="logo" />
        <div className="gif-container">
          <img
            src="/src/assets/images/Front_loading_animation.gif"
            alt="Animated GIF"
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="big-card">
          <div className="card" onClick={() => handleRoleSelection("agent")}>
            <img
              src="/src/assets/images/travel_agent_icon.png"
              alt="Agent Icon"
              className="icon"
            />
            <h2>Travel Agent</h2>
          </div>
          <div className="card" onClick={() => handleRoleSelection("company")}>
            <img
              src="/src/assets/images/travel_company_icon.png"
              alt="Company Icon"
              className="icon"
            />
            <h2>Travel Company</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
