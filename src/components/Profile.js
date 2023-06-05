import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Typography, makeStyles } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logout, auth } from "../firebaseConfig.js";

const useStyles = makeStyles((theme) => ({
    profileContainer: {
        display: "flex",
        alignItems: "center",
    },
    avatar: {
        marginRight: theme.spacing(1),
    },
}));

const Profile = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    useEffect(() => {
        // Check if the user is logged in

        const currentUser = localStorage.getItem("currentUser");
        const user = currentUser ? JSON.parse(currentUser) : null;

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is logged in, save user to local storage
                localStorage.setItem("currentUser", JSON.stringify(user));
            } else {
                // User is not logged in, navigate to login page
                navigate("/login");
            }

            // Cleanup the subscription
            return () => unsubscribe();
        });

        // Get the current user's UID from Firebase
        const uid = user ? user.uid : null;

        axios
            .get("http://localhost:5000/getUserDeets")
            .then((response) => {
                const data = response.data;
                setUsername(data.username);
            })
            .catch((error) => {
                console.error("Failed to retrieve user data:", error);
            });

        // Cleanup the subscription
        return () => unsubscribe();
    }, []);

    // Generate a random number between 1 and 100 for the avatar color
    const avatarColor = Math.floor(Math.random() * 100) + 1;

    return (
        <div className={classes.profileContainer}>
            <Avatar
                className={classes.avatar}
                sx={{
                    bgcolor: `#${avatarColor.toString(16)}`,
                }}
            >
                <AccountCircleIcon />
            </Avatar>
            <Typography variant="subtitle1">{username}</Typography>
        </div>
    );
};

export default Profile;
