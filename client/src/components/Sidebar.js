import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../static/logo.png";
import vrv from "../static/vrv.png"; // Make sure the logo image is in the correct path.
import "../styles/sidebar.css"; // Add a separate CSS file for the sidebar styles.

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <img src={vrv} alt="Logo" className="logo" />
      </div>
      {/* Navigation Links */}
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/roles"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Roles
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/audit-logs"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Audit Logs
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
