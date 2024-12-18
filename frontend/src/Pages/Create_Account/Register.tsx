import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.scss";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
  });
  const [error, setError] = useState<string>("");

  const handleShowPasswordChange = () => {
    setForm({ ...form, showPassword: !form.showPassword });
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/auth/register", form);
      alert("Registration successful! Redirecting to Sign In.");
      navigate("/signin/:role");
    } catch {
      setError("Registration failed! Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="left-column">
        <div className="content-container">
          <h1 className="register_heading">Book with us!</h1>
          <p className="register_paragraph">
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
          <h1 className="Registerform_heading">Create an account</h1>
          <div className="Register_account_sub">
            <span className="Register_account_sub_Text">
              Already have an account?{" "}
            </span>
            <span
              className="registerSign_up_link"
              onClick={() => navigate("/signIn/:role")}
            >
              Log In
            </span>
          </div>
          <form className="Register_form" onSubmit={handleRegister}>
            <div className="input_halfWidth">
              <div className="input-group">
                <label className="registerInput_label" htmlFor="firstName">
                  First name
                </label>
                <input
                  className="inputfield_halfwidth"
                  type="text"
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  placeholder="Enter First Name"
                  required
                />
              </div>

              <div className="input-group">
                <label className="registerInput_label" htmlFor="lastName">
                  Last name
                </label>
                <input
                  className="inputfield_halfwidth"
                  type="text"
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  placeholder="Enter Last Name"
                  required
                />
              </div>
            </div>

            <div className="registeremail_input_group">
              <label className="registerInput_label" htmlFor="email">
                Email address
              </label>
              <input
                className="email_inputfield"
                type="email"
                id="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter Email"
                required
              />
            </div>
            <div className="input_halfWidth">
              <div className="input-group">
                <label className="registerInput_label" htmlFor="password">
                  Password
                </label>
                <input
                  className="inputfield_halfwidth"
                  type={form.showPassword ? "text" : "password"}
                  id="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Enter Password"
                  required
                />
              </div>

              <div className="input-group">
                <label
                  className="registerInput_label"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  className="inputfield_halfwidth"
                  type={form.showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="showPassword"
                checked={form.showPassword}
                onChange={handleShowPasswordChange}
                className="checkbox_input"
              />
              <label htmlFor="showPassword" className="checkbox_label">
                Show Password
              </label>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button className="submit_button" type="submit">
              Create an account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
