import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../pages/Auth/image.jpg'; // adjust path as needed

const NavbarTest = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");
  const token = isAuthenticated;

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    alert("Logged out!");
    navigate('/auth/login');
  };

  return (
    <header className="sticky top-0 z-50 ">
      {/* Top Blue Header with Logout */}
      <div className="bg-[#01316B] border-b-[6px] border-[#DC0022] py-3 px-6 flex items-center justify-between       ">
        {/* Logo */}
        <div className="px-[68px] py-[4px]">
          <img src={logo} alt="Accelerate Logo" className="h-12" />
        </div>
        
        {/* Auth Button */}
        <div>

        {token && username && (
            <span className="text-white font-medium mr-[68px] ">{username}</span>
          )}


{token ? (
  <span
    onClick={logout}
    className="text-white px-3 py-1 mr-[68px] cursor-pointer"
  >
    Logout
  </span>
) : (
  <Link
    to="/auth/login"
    className="text-white px-3 py-1 mr-[68px]"
  >
    Login
  </Link>
)}

        </div>
      </div>

      {/* Navigation Links on Narrower Red Bar */}
      <nav className="bg-[#DC0022]">
  <ul className="max-w-6xl mx-auto px-1 py-[1px] flex flex-wrap items-center justify-between gap-2 text-sm sm:text-base font-medium text-white">
    <li><Link to="/" className="hover:text-yellow-300 transition">Home</Link></li>
    <li><Link to="/employees" className="hover:!text-yellow-300 transition">Manage Employees</Link></li>
    <li><Link to="/locations" className="hover:text-yellow-300 transition">Manage Locations</Link></li>
    <li><Link to="/departments" className="hover:text-yellow-300 transition">Manage Departments</Link></li>
    <li><Link to="/job-positions" className="hover:text-yellow-300 transition">Manage Job Positions</Link></li>
    <li><Link to="/roles" className="hover:text-yellow-300 transition">Manage Role</Link></li>
  </ul>
</nav>

    </header>
  );
};

export default NavbarTest;
