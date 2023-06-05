import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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
    const [emailid, setEmailid] = useState("");

    useEffect(() => {
        // Check if the user is logged in

        const currentUser = localStorage.getItem("currentUser");
        const user = currentUser ? JSON.parse(currentUser) : null;

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // User is logged in, save user to local storage
                localStorage.setItem("currentUser", JSON.stringify(user));
                setEmailid(user.email);
            } else {
                // User is not logged in, navigate to login page
                navigate("/login");
            }

            // Cleanup the subscription
            return () => unsubscribe();
        });

        axios
            .get("http://localhost:5000/getUserDeets", {
                params: { email: emailid },
            })
            .then((response) => {
                console.log(response);
                const data = response.data;
                setUsername(data.username);
            })
            .catch((error) => {
                console.error("Failed to retrieve user data:", error);
            });

        // Cleanup the subscription
        return () => unsubscribe();
    }, [navigate]);

    // Generate a random number between 1 and 100 for the avatar color
    // const avatarColor = Math.floor(Math.random() * 100) + 1;

    return (
        <div className={classes.profileContainer}>
            {/* <Avatar
                className={classes.avatar}
                sx={{
                    bgcolor: `#${avatarColor.toString(16)}`,
                }}
            >
                <AccountCircleIcon />
            </Avatar> */}
            <Typography>Username: {username}</Typography>
            <Typography>Email: {emailid}</Typography>
        </div>
    );
};

export default Profile;
