import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Fab,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { logout, auth } from "../firebaseConfig.js";
import LogoutIcon from "@mui/icons-material/Logout";
import Navbar from "./Navbar.js";

const useStyles = makeStyles((theme) => ({
    tableHeader: {
        fontWeight: "bold",
        fontSize: "1.1rem",
    },
    tableCell: {
        backgroundColor: theme.palette.background.default,
    },
}));

const Dashboard = () => {
    const classes = useStyles();
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

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
        });

        // Get the current user's UID from Firebase
        const uid = user ? user.uid : null;
        // console.log("UID");
        // console.log(uid);

        // Fetch items from the server
        axios
            .get("https://expirytracker-brain.onrender.com/api/items", {
                params: { uid: uid },
            })
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                console.error("Error retrieving items:", error);
            });

        // Cleanup the subscription
        return () => unsubscribe();
    }, [navigate]);

    // Sort items by expiry date (closest to furthest)
    const sortedItems = items.sort((a, b) => {
        const expiryDateA = new Date(a.expiryDate);
        const expiryDateB = new Date(b.expiryDate);
        return expiryDateA - expiryDateB;
    });

    const handleLogout = () => {
        logout()
            .then(() => {
                // Clear the current user from localStorage
                localStorage.removeItem("currentUser");
                // User is successfully logged out, navigate to login page
                navigate("/login");
            })
            .catch((error) => {
                console.error("Error logging out:", error);
            });
    };

    return (
        <div>
            <Navbar />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHeader}>
                                Item Name
                            </TableCell>
                            <TableCell className={classes.tableHeader}>
                                Comments
                            </TableCell>
                            <TableCell className={classes.tableHeader}>
                                Expiry Date
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedItems.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell className={classes.tableCell}>
                                    {item.name}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    {item.comments}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    {item.expiryDate}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Fab
                color="primary"
                aria-label="logout"
                onClick={handleLogout}
                style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                }}
            >
                <LogoutIcon />
            </Fab>
        </div>
    );
};

export default Dashboard;
