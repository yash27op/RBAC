import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/rolespage.css";

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState(""); // Search input
  const [showAddRoleForm, setShowAddRoleForm] = useState(false); // Toggle add role form
  const [newRole, setNewRole] = useState({ name: "", perks: [false, false, false, false, false] }); // New role data

  // Fetch roles from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/roles")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  // Toggle a perk for a specific role
  const togglePerk = (roleId, perkIndex) => {
    const updatedRoles = roles.map((role) =>
      role.id === roleId
        ? {
            ...role,
            perks: role.perks.map((perk, index) =>
              index === perkIndex ? !perk : perk
            ),
          }
        : role
    );

    const updatedRole = updatedRoles.find((role) => role.id === roleId);
    axios
      .put(`http://localhost:5000/roles/${roleId}`, updatedRole)
      .then(() => {
        setRoles(updatedRoles);
      })
      .catch((error) => {
        console.error("Error updating perks:", error);
      });
  };

  // Add a new role
  const handleAddRole = () => {
    if (!newRole.name) {
      alert("Please provide a role name");
      return;
    }

    axios
      .post("http://localhost:5000/roles", newRole)
      .then((response) => {
        setRoles([...roles, response.data]);
        setNewRole({ name: "", perks: [false, false, false, false, false] });
        setShowAddRoleForm(false);
      })
      .catch((error) => {
        console.error("Error adding role:", error);
      });
  };

  // Remove a role
  const handleRemoveRole = (roleId) => {
    axios
      .delete(`http://localhost:5000/roles/${roleId}`)
      .then(() => {
        setRoles(roles.filter((role) => role.id !== roleId));
      })
      .catch((error) => {
        console.error("Error removing role:", error);
      });
  };

  return (
    <div className="roles-page">
      <div className="roles-content">
          <div className="header-actions">
            <input
              type="text"
              placeholder="Search Role"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button onClick={() => setShowAddRoleForm(true)} className="add-role-button">
              Add Role
            </button>
          </div>
        </div>

        <table className="roles-table">
          <thead>
            <tr>
              <th>Roles</th>
              <th>Upload</th>
              <th>Remove</th>
              <th>Ban</th>
              <th>Read only</th>
              <th>Report </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles
              .filter((role) => role.name.toLowerCase().includes(search.toLowerCase()))
              .map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  {role.perks.map((perk, perkIndex) => (
                    <td key={perkIndex}>
                      <button
                        className={`perk-button ${perk ? "active" : ""}`}
                        onClick={() => togglePerk(role.id, perkIndex)}
                      >
                        {perk ? "✔" : ""}
                      </button>
                    </td>
                  ))}
                  <td>
                    <button
                      className="delete-role-button"
                      onClick={() => handleRemoveRole(role.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Add Role Form */}
        {showAddRoleForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add Role</h3>
              <input
                type="text"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="Role Name"
                className="modal-input"
              />
              <div className="modal-actions">
                <button onClick={handleAddRole} className="save-button">
                  Save
                </button>
                <button
                  onClick={() => setShowAddRoleForm(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default RolesPage;
