// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./authstyle.css"; // assuming your CSS is here
import { Eye, EyeOff } from "lucide-react"; // or any icon library you use

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const apiUrl = "https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/auth/login";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.token) {
        localStorage.setItem("authToken", result.token);
        alert("Login successful!");
        navigate("/");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <section className="container-login forms">
      <div className="form login">
        <div className="form-content">
          <header className="login-header">Login</header>
          <form onSubmit={handleLoginSubmit}>
            <div className="field input-field">
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field input-field" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <button type="submit" className="btn">Login</button>
            </div>
          </form>

          <div className="form-link">
            <span>
              Don't have an account?{" "}
              <a href="/auth/signup" className="link signup-link">
                Signup
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
