import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  let navigate = useNavigate();





  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const recoverGmail = localStorage.getItem("gmail"); // Retrieve the Gmail from localStorage
      const API_URL = `http://localhost:3001/gmail/${recoverGmail}`;

      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }), // Only send the new password
      });

      const data = await response.json(); // Parse the response as JSON

      if (response.ok) {
        setMessage("Password reset successfully!");
        navigate("/signin"); // Redirect to sign-in after success
        console.log("Sign-in successful:", data);
      } else {
        setError(data.message || "Something went wrong. Please try again."); // Display API error messages
      }

      // Clear password fields
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Something went wrong. Please try again."); // Handle unexpected errors
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Reset Your Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          required
          fullWidth
          label="New Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          type="text"
          error={!!error}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="text"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Reset Password
        </Button>
      </form>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {message && (
        <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default NewPassword;






