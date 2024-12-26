import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SixOtp = () => {
    const API_URL = "http://localhost:3001/checkotp"; // Update to your actual endpoint
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [expiryTime, setExpiryTime] = useState(null); // State to store OTP expiry time
    const [timeLeft, setTimeLeft] = useState(0); // State to store remaining time in seconds

    let navigate = useNavigate();

    useEffect(() => {
        // Fetch OTP expiry status on component mount
        const fetchOtpExpiry = async () => {
            try {
                const recoverGmail = localStorage.getItem("gmail");
                const response = await fetch(
                    `${API_URL}?recoverGmail=${recoverGmail}`,
                    {
                        // Pass the user's email here
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    const expiry = new Date(data.otpExpiry);
                    setExpiryTime(expiry); // Store expiry time received from the backend
                    const remainingTime = Math.floor((expiry - Date.now()) / 1000); // Calculate remaining time in seconds
                    setTimeLeft(remainingTime);
                } else {
                    setMessage(data.message || "Something went wrong.");
                }
            } catch (err) {
                setError(true);
                setMessage("Failed to fetch OTP expiry time.");
            }
        };

        fetchOtpExpiry();
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const intervalId = setInterval(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
            }, 1000);

            // Cleanup the interval on component unmount or when timeLeft reaches 0
            return () => clearInterval(intervalId);
        }

        // Clear the timer when the OTP has expired
        if (timeLeft <= 0) {
            setMessage("OTP has expired.");
        }
    }, [timeLeft]);

    const handleChange = (e, index) => {
        const input = e.target.value.replace(/[^0-9]/g, ""); // Allow only numeric input
        const newOtp = [...otp];

        if (input.length > 1) {
            // Handle paste: distribute the digits across fields
            const digits = input.split("");
            digits.forEach((digit, i) => {
                if (index + i < otp.length) {
                    newOtp[index + i] = digit;
                }
            });
        } else {
            // Handle single-digit input
            newOtp[index] = input;
        }

        setOtp(newOtp);

        // Automatically move focus
        if (input && index < otp.length - 1) {
            const nextField = document.getElementById(`otp-${index + 1}`);
            nextField?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevField = document.getElementById(`otp-${index - 1}`);
            prevField?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.some((digit) => digit === "")) {
            setError(true);
            setMessage("Please enter a 6-digit OTP.");
            return;
        }

        try {
            setError(false);
            setMessage("");
            setLoading(true);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    otp: otp.join(""),
                    recoverGmail: "test@example.com", // Pass the Gmail associated with OTP here
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("OTP is correct. You can now reset your password.");
                navigate("/password");
            } else {
                setError(true);
                setMessage(data.message || "Invalid OTP. Please try again.");
            }

            setOtp(["", "", "", "", "", ""]); // Clear fields
        } catch (err) {
            setError(true);
            setMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Format the remaining time in a readable format (mm:ss)
    const formatTimeLeft = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
            }`;
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
                Verify OTP
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Enter the 6-digit OTP sent to your email.
            </Typography>
            {expiryTime && timeLeft > 0 && (
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    OTP will expire in: {formatTimeLeft(timeLeft)}
                </Typography>
            )}
            {timeLeft <= 0 && (
                <Typography variant="body2" color="error" gutterBottom>
                    OTP has expired.
                </Typography>
            )}
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    {otp.map((digit, index) => (
                        <TextField
                            key={index}
                            id={`otp-${index}`}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            inputProps={{
                                maxLength: 6, // Allow pasting a full OTP
                                inputMode: "numeric",
                            }}
                            sx={{
                                width: "45px",
                                textAlign: "center",
                            }}
                            variant="outlined"
                            error={error}
                        />
                    ))}
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={loading || timeLeft <= 0} // Disable button if OTP expired
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Verify OTP"
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

export default SixOtp;





