import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box } from "@mui/material";
import TodoList from "./todoApp/todoList";
import Signup from "./auth/signup";
import Signin from "./auth/signin";
import NewPassword from "./auth/forgetPassword";
import SixOtp from "./auth/sixOtp";
import RecoverGmail from "./auth/recoverGamil";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Tracks user authentication
  const API_URL = "http://localhost:3001/user";

  useEffect(() => {
    function getCookie(name) {
      const cookies = document.cookie;
      const cookieArray = cookies.split("; ");

      for (const cookie of cookieArray) {
        const [key, value] = cookie.split("=");
        if (key === name) {
          const decodedValue = decodeURIComponent(value);

          // If the value starts with `j:"` and ends with `"`, clean it
          if (decodedValue.startsWith('j:"') && decodedValue.endsWith('"')) {
            return decodedValue.slice(3, -1); // Remove `j:"` from the start and `"` from the end
          }

          return decodedValue;
        }
      }
      return null;
    }
    const userId = getCookie("userId");
    console.log(userId);

    if (userId) {
      // Send the userId to the backend for verification
      axios
        .post(API_URL, { userId })
        .then((response) => {
          if (response.status === 200) {
            setIsAuthenticated(true); // Authentication successful
          }
        })
        .catch(() => {
          setIsAuthenticated(false); // Authentication failed
        });
    } else {
      setIsAuthenticated(false); // No userId in cookies
    }
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<TodoList />} />
              <Route path="/signin" element={<Navigate to="/" />} />
              <Route path="/signup" element={<Navigate to="/" />} />
              <Route path="/recover" element={<Navigate to="/" />} />
              <Route path="/otp" element={<Navigate to="/" />} />
              <Route path="/password" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/signin" />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/recover" element={<RecoverGmail />} />
              <Route path="/otp" element={<SixOtp />} />
              <Route path="/password" element={<NewPassword />} />
            </>
          )}
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
