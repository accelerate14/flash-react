// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("authToken");
const token=isAuthenticated;
  const logout = () => {
    localStorage.removeItem("authToken");
    alert("Logged out!");
    navigate('/auth/login');
  };

  return (
    <header className="bg-gray-100 shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <ul className="flex flex-wrap items-center justify-between gap-4 text-sm sm:text-base font-medium text-black">
          <li><Link to="/" className="hover:text-blue-600 transition">Home</Link></li>
          <li><Link to="/employees" className="hover:text-blue-600 transition">Manage Employees</Link></li>
          <li><Link to="/locations" className="hover:text-blue-600 transition">Manage Locations</Link></li>
          <li><Link to="/departments" className="hover:text-blue-600 transition">Manage Departments</Link></li>
          <li><Link to="/job-positions" className="hover:text-blue-600 transition">Manage Job Positions</Link></li>
          <li><Link to="/roles" className="hover:text-blue-600 transition">Manage Role</Link></li>
          <li>
            {token ? (
              <button
                onClick={logout}
                className="px-3 py-1 rounded hover:bg-blue-100 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth/login"
                className="px-3 py-1 rounded hover:bg-blue-100 transition"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
