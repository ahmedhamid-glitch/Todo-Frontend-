import React, { useState } from "react";
import { Box, Button, TextField, Typography, Link, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const API_URL = "http://localhost:3001/signin";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",

                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate("/");
                console.log("Sign-in successful:", data);
                setEmail("");
                setPassword("");
                // Redirect user or store token, e.g., localStorage.setItem('token', data.token)
            } else {
                setError(data.message || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // minHeight: "100vh",
                backgroundColor: "#f5f5f5",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    borderRadius: "10px",
                    padding: 4,
                    width: "100%",
                    maxWidth: 400,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
                    Sign In
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        width: "100%",
                    }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email Address"
                        name="email"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ marginTop: 3, marginBottom: 2 }}
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 1,
                        }}
                    >
                        <Link href="/recover" variant="body2">
                            Forgot password?
                        </Link>
                        <Link href="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default SignIn;
