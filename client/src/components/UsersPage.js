import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/userspage.css";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "A" });
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Fetch users from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    axios
      .get("http://localhost:5000/roles")
      .then((response) => setRoles(response.data))
      .catch((error) => console.error("Error fetching roles:", error));
  }, []);

  // Add a new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Please fill in all fields");
      return;
    }

    axios
      .post("http://localhost:5000/users", newUser)
      .then((response) => {
        setUsers([...users, response.data]);
        setNewUser({ name: "", email: "", role: "A" });
        setShowAddUserModal(false);
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };

  // Delete a user
  const handleDeleteUser = (id) => {
    axios
      .delete(`http://localhost:5000/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  // Update a user
  const handleUpdateUser = () => {
    axios
      .put(`http://localhost:5000/users/${editingUser.id}`, editingUser)
      .then((response) => {
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? response.data : user
          )
        );
        setEditingUser(null);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  return (
    <div className="user-page">
      <div className="header">
        <input
          type="text"
          placeholder="Search by Name"
          value={search}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="search-input"
        />
        <button
          onClick={() => setShowAddUserModal(true)}
          className="add-user-button"
        >
          Add User
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) =>
              user.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setEditingUser(user)}
                    className="modify-button"
                  >
                    Modify
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add User</h3>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Name"
            />
            <input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              placeholder="Email"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button onClick={handleAddUser} className="save-button">
                Save
              </button>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <div className="edit-form">
          <h3>Modify User</h3>
          <input
            type="text"
            value={editingUser.name}
            onChange={(e) =>
              setEditingUser({ ...editingUser, name: e.target.value })
            }
          />
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) =>
              setEditingUser({ ...editingUser, email: e.target.value })
            }
          />
          <select
            value={editingUser.role}
            onChange={(e) =>
              setEditingUser({ ...editingUser, role: e.target.value })
            }
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
          <button onClick={handleUpdateUser} className="update-button">
            Update User
          </button>
          <button
            onClick={() => setEditingUser(null)}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPage;
