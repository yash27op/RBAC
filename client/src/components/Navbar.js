import React from "react";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../static/logo.png"; // Replace with your actual logo path

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">My Dashboard</div>
      <div className="navbar-profile">
        <Avatar
          src={logo}
          alt="Profile"
          onClick={handleProfileClick}
          sx={{ cursor: "pointer" }}
        />
        <span onClick={handleProfileClick} style={{ cursor: "pointer" }}>
          Profile
        </span>
        <button
          onClick={handleLogout}
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
