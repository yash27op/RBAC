import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import UsersPage from "./components/UsersPage";
import RolesPage from "./components/RolesPage";
import AuditLogsPage from "./components/AuditLogsPage";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import Navbar from "./components/Navbar";
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  // State to manage authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Login handler to update auth state
  const handleLogin = (email, password) => {
    // Dummy authentication logic
    if (email === "admin@example.com" && password === "admin123") {
      const token = `token-${Date.now()}`; // Dummy token
      localStorage.setItem("authToken", token); // Save token in local storage
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar and Navbar are only visible if authenticated */}
        {isAuthenticated && (
          <>
            <Sidebar onLogout={handleLogout} />
            <Navbar onLogout={handleLogout} />
          </>
        )}
        <div className={`content-container ${isAuthenticated ? "with-sidebar" : ""}`}>
          <Routes>
            {/* Login Route */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/users" replace />
                ) : (
                  <LoginPage checkLogin={handleLogin} />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/users"
              element={
                isAuthenticated ? (
                  <UsersPage onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/roles"
              element={
                isAuthenticated ? (
                  <RolesPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/audit-logs"
              element={
                isAuthenticated ? (
                  <AuditLogsPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Profile Route */}
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <ProfilePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Default Route */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/users" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
