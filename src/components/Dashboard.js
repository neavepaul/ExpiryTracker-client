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
    TextField,
    Paper,
    Fab,
    Typography,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { logout, auth } from "../firebaseConfig.js";
import LogoutIcon from "@mui/icons-material/Logout";
import DoneIcon from "@mui/icons-material/Done";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "./Navbar.js";

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
        backgroundColor: theme.palette.background.default,
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

const Dashboard = () => {
    const classes = useStyles();
    const [items, setItems] = useState([]);
    const [sortedItems, setSortedItems] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [showSearchIcon, setShowSearchIcon] = useState(true);
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
        // console.log("UID");
        // console.log(uid);

        // Fetch items from the server
        axios
            .get("https://expirytracker-brain.onrender.com/api/items", {
                params: { uid: uid },
            })
            .then((response) => {
                setItems(response.data);
                setSortedItems(response.data);
            })
            .catch((error) => {
                console.error("Error retrieving items:", error);
            });

        // Cleanup the subscription
        return () => unsubscribe();
    }, [navigate]);

    // Sort items by expiry date (closest to furthest)
    const sortedItemsByExpiry = sortedItems.sort((a, b) => {
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

    useEffect(() => {
        const expiredItems = items.filter((item) => {
            const expiryDate = new Date(item.expiryDate);
            const today = new Date();
            return expiryDate < today;
        });

        if (expiredItems.length > 0) {
            axios
                .post(
                    "https://expirytracker-brain.onrender.com/move-to-expired",
                    {
                        items: expiredItems,
                    }
                )
                .then(() => {
                    console.log("Expired items moved to /expired");
                    // Remove the expired items from the dashboard
                    const updatedItems = items.filter((item) => {
                        const expiryDate = new Date(item.expiryDate);
                        const today = new Date();
                        return expiryDate >= today;
                    });
                    setItems(updatedItems);
                })
                .catch((error) => {
                    console.error("Error moving expired items:", error);
                });
        }
    }, [items]);

    const handleDelete = (itemId) => {
        // Send a request to the server to delete the item
        axios
            .post("https://expirytracker-brain.onrender.com/deleteItem", {
                product_id: itemId,
            })
            .then((response) => {
                if (response.data === "success") {
                    // If the deletion is successful, update the items state
                    setItems((prevItems) =>
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);

        // Filter items based on the search input
        const filteredItems = items.filter((item) =>
            item.name.toLowerCase().includes(event.target.value.toLowerCase())
        );

        setSortedItems(filteredItems);
    };

    const handleFocus = () => {
        setShowSearchIcon(false);
    };

    const handleBlur = () => {
        setShowSearchIcon(true);
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
            <TextField
                label="Search by Name"
                variant="outlined"
                value={searchInput}
                onChange={handleSearchChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ margin: "16px", width: "92%" }}
                InputProps={{
                    startAdornment: showSearchIcon && (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
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
                        {sortedItemsByExpiry.map((item) => (
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
                                    <DoneIcon
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

export default Dashboard;
