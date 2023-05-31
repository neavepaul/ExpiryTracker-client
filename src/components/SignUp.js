import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@material-ui/core";
import { AccountCircle, Email, Lock } from "@material-ui/icons";
import axios from "axios";
import { createUser, auth } from "../firebaseConfig.js";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // const saveUserToMongo = (email, username) => {
    //     axios
    //         .post("http://localhost:5000/signup", { email, username })
    //         .then(() => navigate("/login"))
    //         .catch((error) => {
    //             setError("Error signing up. Please try again.");
    //         });
    // };

    // const handleSignup = () => {
    //     createUser(email, password)
    //         .then(() => saveUserToMongo(email, username))
    //         .catch((error) => {
    //             console.log(error);
    //             setError("Error signing up. Please try again.");
    //         });
    // };

    const saveUserToMongo = (email, username) => {
        axios
            .post("http://localhost:5000/signup", { email, username })
            .then(console.log("mongo user add complete"))
            .catch((error) => {
                setError("Error signing up. Please try again.");
            });
    };

    const handleSignup = () => {
        createUser(
            email,
            password,
            () => {
                saveUserToMongo(email, username);
            },
            (error) => {
                console.log(error);
                setError("Error signing up. Please try again.");
            },
            saveUserToMongo
        );
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is logged in, navigate to dashboard
                navigate("/login");
            }
        });

        // Cleanup the subscription
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div>
            <Typography variant="h2">Signup</Typography>
            <TextField
                variant="outlined"
                fullWidth
                si
                margin="normal"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                    startAdornment: <AccountCircle />,
                }}
            />
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
            <Button variant="contained" color="primary" onClick={handleSignup}>
                Signup
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </div>
    );
};

export default Signup;
