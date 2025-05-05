import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./authstyle.css"; // make sure this path is correct

const Signup = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords must match.");
      return;
    }

    const signUpApiUrl = "https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/auth/register";

    const data = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const response = await fetch(signUpApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.token) {
        localStorage.setItem("authToken", result.token);
        alert("Registered successfully!");
        navigate("/");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="container-login forms">
      <div className="form signup">
        <div className="form-content">
          <header className="login-header">Signup</header>
          <form onSubmit={handleSubmit}>
            <div className="name-fields">
              <div className="field input-field">
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  className="input"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field input-field">
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  className="input"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="field input-field">
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field input-field">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="password"
                value={formData.password}
                onChange={handleChange}
                required
              />


              
            </div>

            <div className="field input-field" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm Password"
                className="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <div className="field button-field">
              <button type="submit" className="btn">Signup</button>
            </div>
          </form>

          <div className="form-link">
            <span>
              Already have an account?{" "}
              <Link to="/auth/login" className="link login-link">Login</Link>  
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;



