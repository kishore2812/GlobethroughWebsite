import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignIn.scss";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/signin",
        form
      );
      const { token } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);
      navigate("/HomePage");
    } catch {
      setError("Invalid email or password, please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="container">
      <div className="left-column">
        <div className="content-container">
          <h1 className="heading1">Book with us!</h1>
          <p className="paragraph1">
            Sign in to continue accessing your account.
          </p>
          <div className="logo-container">
            <img
              src="/src/assets/images/logo.png"
              alt="Logo"
              className="logo"
            />
            <img
              src="/src/assets/images/Front_loading_animation.gif"
              alt="Animated GIF"
              className="background-image"
            />
          </div>
        </div>
      </div>

      <div className="right-column">
        <div className="form-card">
          <h1 className="right_columnHeading">Sign In</h1>
          <p>
            Are you a subuser?
            <Link to="/subuser-login">Click here to log in as Subuser</Link>
          </p>
          <form className="signin_form" onSubmit={handleSignIn}>
            <label className="sign_input_label" htmlFor="email">
              Email
            </label>
            <div className="password-container">
              <input
                className="signin_input"
                type="email"
                id="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
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
              Sign In
            </button>

            {error && <div className="error">{error}</div>}

            <span className="create-account">
              Don’t have an account?{" "}
              <span
                className="sign_up_link"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
