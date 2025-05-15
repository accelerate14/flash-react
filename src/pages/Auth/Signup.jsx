import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "./image.jpg"; // Assuming the image is in the same directory

const Signup = () => {
    const navigate = useNavigate();
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
        <div className="min-h-screen bg-white flex flex-col">
            {/* Top Blue Header with Red Bottom Border */}
            <div className="bg-[#01316B] border-b-[14px] border-[#DC0022] py-3 px-6 flex items-center justify-between ">
                {/* Logo image */}
                <div className="px-[68px] py-[4px]">
                    <img src={logo} alt="Accelerate Logo" className="h-12" />
                </div>
            </div>

            {/* Page Title */}
            <div className="mt-10 text-center">
                <div
                    className="italic   text-[#010411] text-[25px] font-bold"
                    style={{
                        fontFamily: "Roboto, sans-serif",
                        letterSpacing: "6%",
                    }}
                >
                    Accelirate Resource Management System
                </div>
            </div>

            {/* Signup Form Card */}
            <div className="flex items-center justify-center   bg-white px-[27px]">
                <div className="w-full max-w-sm bg-gray-50 p-6 rounded-xl space-y-[14px] mt-[35px]">
                    <h2 className="text-lg font-bold text-center mb-4">Signup</h2>
                    <form onSubmit={handleSubmit}>
                        {/* First Name Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Last Name Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-4 relative">
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="mb-4 relative">
                            <label className="block text-sm font-medium mb-1">Confirm Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[54%] cursor-pointer text-gray-500 transform -translate-y-1/2"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                        </div>

                        {/* Sign Up Button */}
                        <div className="flex justify-center mt-4">
                            <button
                                type="submit"
                                className="w-[181px] h-[41px] text-black font-semibold rounded-[10px] border-2 border-black shadow-sm"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    {/* Login Link */}
                    <div
                        className="mt-4 text-center text-[16px] text-[#010411]"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                        Already have an account?{" "}
                        <Link to="/auth/login" className="hover:underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
