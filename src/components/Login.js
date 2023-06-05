import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, TextField, Typography } from "@material-ui/core";
import { Email, Lock } from "@material-ui/icons";
import { loginUser, auth } from "../firebaseConfig.js";
import "../css/Login.css";
import HomeNavbar from "./HomeNavbar.js";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        loginUser(email, password);
        const user = auth.currentUser;
        localStorage.setItem("currentUser", JSON.stringify(user));
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is logged in, navigate to dashboard
                navigate("/dash");
            }
        });

        // Cleanup the subscription
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div>
            <HomeNavbar />
            <Typography variant="h2">Login</Typography>
            <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                    startAdornment: <Email />,
                }}
            />
            <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                    startAdornment: <Lock />,
                }}
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>
                Login
            </Button>
            <Typography variant="body1" gutterBottom>
                Don't have an account?{" "}
                <Link to="/signup">Time to join the cool kids club</Link>!
            </Typography>
            {/* {error && <Typography color="error">{error}</Typography>} */}
        </div>
    );
};

export default Login;
