import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebaseConfig.js";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    Fab,
    TableContainer,
    Typography,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "./Navbar.js";
import LogoutIcon from "@mui/icons-material/Logout";

const useStyles = makeStyles((theme) => ({
    tableHeader: {
        fontWeight: "bold",
        fontSize: "1 rem",
    },
    tableCell: {
        backgroundColor: "lightcoral", // Set the background color to light red
    },
    fab: {
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

const Expired = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [expiredItems, setExpiredItems] = useState([]);

    useEffect(() => {
        axios
            .get("https://expirytracker-brain.onrender.com/expired-items")
            .then((response) => {
                const items = removeDuplicates(response.data);
                setExpiredItems(items);
                // setExpiredItems(response.data);
            })
            .catch((error) => {
                console.error("Error retrieving expired items:", error);
            });
    }, []);

    const removeDuplicates = (items) => {
        // Create a map to track unique items
        const uniqueItemsMap = new Map();

        // Iterate through the items and add them to the map
        items.forEach((item) => {
            const key = item.name + item.expiryDate;
            uniqueItemsMap.set(key, item);
        });

        // Return the unique items from the map
        return Array.from(uniqueItemsMap.values());
    };

    const handleDelete = (itemId) => {
        // Send a request to the server to delete the item
        axios
            .post("https://expirytracker-brain.onrender.com/deleteExItem", {
                product_id: itemId,
            })
            .then((response) => {
                if (response.data === "success") {
                    // If the deletion is successful, update the items state
                    setExpiredItems((prevItems) =>
                        prevItems.filter((item) => item._id !== itemId)
                    );
                } else {
                    console.error("Failed to delete item.");
                }
            })
            .catch((error) => {
                console.error("Error deleting item:", error);
            });
    };

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
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
                                <Typography variant="h6" component="div">
                                    Item Name
                                </Typography>
                            </TableCell>
                            <TableCell className={classes.tableHeader}>
                                <Typography variant="h6" component="div">
                                    Comments
                                </Typography>
                            </TableCell>
                            <TableCell className={classes.tableHeader}>
                                <Typography variant="h6" component="div">
                                    Expiry Date
                                </Typography>
                            </TableCell>
                            <TableCell className={classes.tableHeader}>
                                <Typography variant="h6" component="div">
                                    Used
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expiredItems.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell className={classes.tableCell}>
                                    {item.name}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    {item.comments}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    {formatDate(item.expiryDate)}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    <DeleteIcon
                                        color="primary"
                                        onClick={() => handleDelete(item._id)}
                                    />
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

export default Expired;
