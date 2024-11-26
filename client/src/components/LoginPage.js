import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRive, useStateMachineInput } from "rive-react";

const theme = createTheme();

const STATE_MACHINE_NAME = "State Machine 1";

const LoginPage = ({ checkLogin }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const { rive, RiveComponent } = useRive({
    src: "520-990-teddy-login-screen.riv",
    autoplay: true,
    stateMachines: STATE_MACHINE_NAME,
  });

  const stateSuccess = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "success"
  );
  const stateFail = useStateMachineInput(rive, STATE_MACHINE_NAME, "fail");
  const stateHandUp = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "hands_up"
  );

  const stateCheck = useStateMachineInput(rive, STATE_MACHINE_NAME, "Check");
  const stateLook = useStateMachineInput(rive, STATE_MACHINE_NAME, "Look");

  const triggerSuccess = () => {
    stateSuccess && stateSuccess.fire();
  };

  const triggerFail = () => {
    stateFail && stateFail.fire();
  };

  const setHangUp = (value) => {
    stateHandUp && (stateHandUp.value = value);
  };

  const setCheck = (value) => {
    stateCheck && (stateCheck.value = value);
  };

  useEffect(() => {
    if (stateLook) {
      let ratio = (user.length / 41) * 100 - 25; // Adjust for input length
      stateLook.value = Math.round(ratio);
    }
  }, [user, stateLook]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setCheck(true);
    if (checkLogin(user, password)) {
      triggerSuccess();
      setTimeout(() => {
        window.location.href = "/users"; // Redirect to dashboard
      }, 1000); // Delay for animation
    } else {
      triggerFail();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <RiveComponent
              style={{ width: "100%", height: "100%" }}
              src="520-990-teddy-login-screen.riv"
            />
          </div>
          <Typography variant="h5" sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              mt: 4,
              mx: "auto",
              maxWidth: "400px",
              p: 3,
              border: "1px solid #ddd",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                py: 1.5,
                borderRadius: "25px",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
