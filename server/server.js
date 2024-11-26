const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const DB_FILE = "./db.json"; // JSON database path

// Middleware
app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());

// Helper functions
const readDatabase = () => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database:", err.message);
    // Handle corrupted file by resetting it
    if (err instanceof SyntaxError) {
      console.error("Resetting db.json to default structure...");
      const defaultData = { users: [], roles: [], auditLogs: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    throw err; // Re-throw other errors
  }
};

const writeDatabase = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to database:", err);
    throw new Error("Failed to write to database");
  }
};

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the RBAC Backend Server!");
});
app.get("/users", (req, res) => {
  const db = readDatabase();
  res.json(db.users);
});

app.get("/users", (req, res) => {
  try {
    const db = readDatabase();
    if (!db || !db.users) {
      return res.status(500).json({ error: "Failed to read users" });
    }
    res.json(db.users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /users/:id - Fetch a single user by ID
app.get("/users/:id", (req, res) => {
  const db = readDatabase();
  const userId = parseInt(req.params.id); // Extract user ID from the URL
  const user = db.users.find((user) => user.id === userId); // Find the user

  if (!user) {
    return res.status(404).json({ error: "User not found" }); // If no user, send 404
  }

  res.json(user); // Return the user as JSON
});

// Update the user
app.put("/users/:id", (req, res) => {
  const db = readDatabase();
  const userId = parseInt(req.params.id);
  const userIndex = db.users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const oldUser = db.users[userIndex];
  const updatedUser = { ...oldUser, ...req.body };
  db.users[userIndex] = updatedUser;

  // Log the action
  db.logs.push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    role: "Admin",
    eventType: "Update",
    changes: `Updated user ${oldUser.name} (${
      oldUser.email
    }). Changes: ${JSON.stringify(req.body)}`,
  });

  writeDatabase(db);
  res.json(updatedUser);
});

// Add a new user
app.post("/users", (req, res) => {
  const db = readDatabase();
  const newUser = { id: Date.now(), ...req.body }; // Generate unique ID for the new user
  db.users.push(newUser);
  // Log the action
  db.logs.push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    role: "Admin", // Assuming the user performing the action is Admin
    eventType: "Create",
    changes: `Added user ${newUser.name} (${newUser.email}) with role ${newUser.role}`,
  });
  writeDatabase(db); // Save to database
  res.status(201).json(newUser); // Return the created user
});

//delete a user
app.delete("/users/:id", (req, res) => {
  const db = readDatabase();
  const userId = parseInt(req.params.id);
  const userToDelete = db.users.find((user) => user.id === userId);

  if (!userToDelete) {
    return res.status(404).json({ error: "User not found" });
  }

  db.users = db.users.filter((user) => user.id !== userId);

  // Log the action
  db.logs.push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    role: "Admin",
    eventType: "Delete",
    changes: `Deleted user ${userToDelete.name} (${userToDelete.email})`,
  });

  writeDatabase(db);
  res.sendStatus(204);
});

// GET /roles - Fetch all roles
app.get("/roles", (req, res) => {
  try {
    const db = readDatabase();
    if (!db || !db.roles) {
      return res.status(404).json({ error: "Roles not found" });
    }
    res.json(db.roles);
  } catch (err) {
    console.error("Error fetching roles:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new role
app.post("/roles", (req, res) => {
  const db = readDatabase();
  const newRole = { id: Date.now(), ...req.body };
  db.roles.push(newRole);

  // Log the action
  db.logs.push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    role: "Admin",
    eventType: "Create",
    changes: `Added role ${newRole.name}`,
  });

  writeDatabase(db);
  res.status(201).json(newRole);
});

// Update a role
app.put("/roles/:id", (req, res) => {
  const db = readDatabase();
  const roleId = parseInt(req.params.id);
  const roleIndex = db.roles.findIndex((role) => role.id === roleId);

  if (roleIndex === -1) {
    return res.status(404).json({ error: "Role not found" });
  }

  const oldRole = db.roles[roleIndex];
  const updatedRole = { ...oldRole, ...req.body };
  db.roles[roleIndex] = updatedRole;

  // Log the action
  db.logs.push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    role: "Admin",
    eventType: "Update",
    changes: `Updated role ${oldRole.name}. Changes: ${JSON.stringify(
      req.body
    )}`,
  });

  writeDatabase(db);
  res.json(updatedRole);
});

// Delete a role
app.delete("/roles/:id", (req, res) => {
  const db = readDatabase();
  const roleId = parseInt(req.params.id);
  const roleToDelete = db.roles.find((role) => role.id === roleId);

  if (!roleToDelete) {
    return res.status(404).json({ error: "Role not found" });
  }

  db.roles = db.roles.filter((role) => role.id !== roleId);

  // Log the action
  db.logs.push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    role: "Admin",
    eventType: "Delete",
    changes: `Deleted role ${roleToDelete.name}`,
  });

  writeDatabase(db);
  res.sendStatus(204);
});

// Get all logs
app.get("/logs", (req, res) => {
  const db = readDatabase();
  res.json(db.logs);
});

// Delete a log
app.delete("/logs/:id", (req, res) => {
  const db = readDatabase();
  const logId = parseInt(req.params.id);
  const filteredLogs = db.logs.filter((log) => log.id !== logId);

  if (db.logs.length === filteredLogs.length) {
    return res.status(404).json({ error: "Log not found" });
  }

  db.logs = filteredLogs;
  writeDatabase(db);
  res.sendStatus(204);
});

// Dummy user data
const users = [
  { email: "user@gmail.com", password: "admin", role: "Admin" },
  { email: "user@example.com", password: "user123", role: "User" },
];

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Generate a dummy token
    const token = `token-${Date.now()}`;
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
