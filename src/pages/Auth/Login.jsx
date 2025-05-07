import React, {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "./image.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);



  
  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const apiUrl =
      "https://flash-backend-cpfrguethpanfhdz.centralus-01.azurewebsites.net/api/auth/login";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.token) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("username", result.email);
        alert("Login successful!");
        navigate("/ex");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Blue Header with Red Bottom Border */}
      <div className="bg-[#01316B] border-b-[14px] border-[#DC0022] py-3 px-6 flex items-center justify-between ">
        {/* Logo image - replace 'logo.png' with actual image path */}
        <div className="px-[68px] py-[4px]">
          <img src={logo} alt="Accelerate Logo" className="h-12" />
        </div>
      </div>

      {/* Page Title */}
      <div className="mt-10 text-center">
        <div
          className="italic   text-[#010411] text-[25px] font-bold"
          style={{
            fontFamily: "Roboto, sans-serif",
            letterSpacing: "6%",
          }}
        >
          Accelirate Resource Management System
        </div>
      </div>

      {/* Login Form Card */}
      <div className="flex items-center justify-center   bg-white px-[27px]">
  <div className="w-full max-w-sm bg-gray-50 p-6 rounded-xl space-y-[14px] mt-[35px]">
    <h2 className="text-lg font-bold text-center mb-4">Login</h2>
    <form onSubmit={handleLoginSubmit}>
      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password Input */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
        <div className="text-right mt-1">
          <a href="#" className="text-xs text-gray-500 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>

      {/* Sign In Button */}
      <div className="flex justify-center mt-4">
  <button
    type="submit"
    className="w-[181px] h-[41px] text-black font-semibold rounded-[10px] border-2 border-black shadow-sm"
  >
    Sign in
  </button>
</div>






    </form>

    {/* Signup Link */}
    <div
  className="mt-4 text-center text-[16px] text-[#010411]"
  style={{ fontFamily: "Roboto, sans-serif" }}
>
  Don’t have an account?{" "}
  <Link to="/auth/signup" className="hover:underline">
    Signup
  </Link>
</div>

  </div>
</div>


    </div>
  );
};

export default Login;
