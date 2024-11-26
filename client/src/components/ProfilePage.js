import React, { useState } from "react";
import { Avatar, TextField, Button, Box, Typography } from "@mui/material";
import logo from "../static/logo.png";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profilePicture: logo,
  });

  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = () => {
    alert(`Password changed to: ${newPassword}`);
    setNewPassword("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Avatar
        alt="Profile Picture"
        src={user.profilePicture}
        sx={{ width: 120, height: 120, marginBottom: 2 }}
      />
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        {user.name}
      </Typography>
      <Typography variant="body1" sx={{ color: "gray", marginBottom: 4 }}>
        {user.email}
      </Typography>
      <TextField
        label="Change Password"
        type="password"
        variant="outlined"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        sx={{ marginBottom: 2, width: "300px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handlePasswordChange}
        sx={{ width: "300px" }}
      >
        Update Password
      </Button>
    </Box>
  );
};

export default ProfilePage;
