import React, {  useState } from "react";
import { Box, Button, TextField, Typography, Link, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [recoverGmail, setRecoverGmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();




    const API_URL = "http://localhost:3001/signup";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password, recoverGmail }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Signup successful! Please log in.");
                navigate("/")
                setName("");
                setEmail("");

                setRecoverGmail("")
                setPassword("");
                setConfirmPassword("");
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
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: "100%",
                    maxWidth: 400,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }}>
                    Sign Up
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
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />


                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="Gmail"
                        label="Recover Gmail"
                        name="gmail"
                        autoComplete="gmail"
                        value={recoverGmail}
                        onChange={(e) => setRecoverGmail(e.target.value)}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {error && (
                        <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                            {error}
                        </Typography>
                    )}
                    {success && (
                        <Typography color="primary" variant="body2" sx={{ marginTop: 1 }}>
                            {success}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ marginTop: 3, marginBottom: 2 }}
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </Button>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 1,
                        }}
                    >
                        <Link href="/signin" variant="body2">
                            {"Already have an account? Sign In"}
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Signup;
