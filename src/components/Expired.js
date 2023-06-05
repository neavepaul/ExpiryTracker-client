import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, auth } from "../firebaseConfig.js";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from "./Navbar.js";
import LogoutIcon from "@mui/icons-material/Logout";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
    },
    tableHeader: {
        fontWeight: "bold",
        fontSize: "1rem",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    tableCell: {
        backgroundColor: "lightcoral", // Set the background color to light red
    },
    fab: {
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    modalContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3),
        outline: "none",
        borderRadius: theme.spacing(1),
        maxWidth: "400px",
        minWidth: "320px",
        margin: "auto",
    },
}));

const Expired = () => {
    const classes = useStyles();
    const [expiredItems, setExpiredItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openModal, setOpenModal] = useState(false);
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

        // Fetch items from the server
        axios
            .get("https://expirytracker-brain.onrender.com/expired-items", {
                params: { uid: uid },
            })
            .then((response) => {
                const items = removeDuplicates(response.data);
                setExpiredItems(items);
            })
            .catch((error) => {
                console.error("Error retrieving items:", error);
            });

        // Cleanup the subscription
        return () => unsubscribe();
    }, [navigate]);

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

    const openItemModal = (item) => {
        setSelectedItem(item);
        setOpenModal(true);
    };

    const closeItemModal = () => {
        setOpenModal(false);
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
                            <TableRow
                                key={item._id}
                                onClick={() => openItemModal(item)}
                                style={{ cursor: "pointer" }}
                            >
                                <TableCell className={classes.tableCell}>
                                    {item.name}
                                </TableCell>
                                <TableCell className={classes.tableCell}>
                                    {formatDate(item.expiryDate)}
                                </TableCell>
                                <TableCell
                                    className={classes.tableCell}
                                    align="center"
                                >
                                    <DeleteIcon
                                        color="black"
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

            {selectedItem && (
                <Dialog
                    open={openModal}
                    onClose={closeItemModal}
                    aria-labelledby="item-dialog-title"
                    className={classes.modal}
                >
                    <DialogTitle id="item-dialog-title">
                        Item Details
                    </DialogTitle>
                    <DialogContent className={classes.modalContent}>
                        <Typography variant="h6" gutterBottom>
                            Name: {selectedItem.name}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Expiry Date: {formatDate(selectedItem.expiryDate)}
                        </Typography>
                        {selectedItem.comments && (
                            <Typography variant="body1" gutterBottom>
                                Description: {selectedItem.comments}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeItemModal}>Close</Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};

export default Expired;
