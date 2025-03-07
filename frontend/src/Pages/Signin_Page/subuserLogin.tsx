import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection in React Router v6+
import { IoEye, IoEyeOff } from "react-icons/io5";
import "./SignIn.scss";
import { api } from "../../Services/api";
import logo from "../../assets/images/logo.png";
import Loading_animation from "../../assets/images/Front_loading_animation.gif";

const SubUserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // useNavigate instead of useHistory

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset any previous error

    try {
      const response = await api.post("/subuser/login", {
        email,
        password,
      });
      const { token } = response.data;
      // Store token in localStorage
      localStorage.setItem("token", token);

      // Redirect to homepage after successful login
      navigate("/homepage"); // Using navigate to redirect
    } catch {
      setError("An error occurred during login");
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  return (
    <div>
      <div className="container">
        <div className="left-column">
          <div className="content-container">
            <h1 className="heading1">Book with us!</h1>
            <p className="paragraph1">
              Sign in to continue accessing your account.
            </p>
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
              <img
                src={Loading_animation}
                alt="Animated GIF"
                className="background-image"
              />
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="form-card">
            <h1 className="right_columnHeading">Sign In as Subuser</h1>
            <form className="signin_form" onSubmit={handleLogin}>
              <label className="sign_input_label" htmlFor="email">
                Email
              </label>
              <div className="password-container">
                <input
                  className="signin_input"
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <label className="sign_input_label" htmlFor="password">
                Password
              </label>
              <div className="password-container">
                <div className="password-input-container">
                  <input
                    className="signin_input"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="eye-icon" onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <>
                        <IoEyeOff size={16} />{" "}
                        <span className="eye-icon_span">Hide</span>
                      </>
                    ) : (
                      <>
                        <IoEye size={16} />{" "}
                        <span className="eye-icon_span">Show</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="forgot-password">
                  <a
                    className="forgot_password_text"
                    href="/forgot-password"
                    style={{ textAlign: "right", color: "#4285f4" }}
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Sign In (SubUser)
              </button>
            </form>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubUserLoginPage;
