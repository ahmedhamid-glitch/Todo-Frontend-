import React, {  useState } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const RecoverGmail = () => {
    const [recoverGmail, setRecoverGmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    let navigate = useNavigate();

    const API_URL = "http://localhost:3001/recover";



    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input
        if (!recoverGmail) {
            setError(true);
            setMessage("Gmail is required.");
            return;
        }
        if (!validateEmail(recoverGmail)) {
            setError(true);
            setMessage("Please enter a valid Gmail address.");
            return;
        }

        try {
            // Clear previous messages
            setError(false);
            setMessage("");
            setLoading(true); // Show loading state

            // Send request to the API
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ recoverGmail }), // Only send Gmail
            });


            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('gmail', recoverGmail);
                navigate("/otp");
                setMessage(
                    "If this Gmail is registered, you'll receive a reset link shortly."
                );
            } else {
                setError(true);
                setMessage(data.message || "Something went wrong. Please try again.");
            }

            // Clear the input field
            // setRecoverGmail("");
        } catch (err) {
            setError(true);
            setMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false); // Hide loading state
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
                Forgot Password?
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Enter your Gmail, and we’ll send you instructions to reset your
                password.
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    required
                    fullWidth
                    label="Gmail Address"
                    variant="outlined"
                    value={recoverGmail}
                    onChange={(e) => setRecoverGmail(e.target.value)}
                    margin="normal"
                    error={error}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Send Reset Link"
                    )}
                </Button>
            </form>

            {message && (
                <Typography
                    variant="body2"
                    color={error ? "error" : "success.main"}
                    sx={{ mt: 2 }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
};

export default RecoverGmail;
