import React, { useState, useEffect } from "react";
import Quagga from "quagga";
import axios from "axios";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
} from "@mui/material";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Alert from "@mui/material/Alert";
import { logout, auth } from "../firebaseConfig.js";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { Fab } from "@mui/material";
import Box from "@mui/material/Box";
import "../css/BarcodeScanner.css";
import Navbar from "./Navbar.js";

const BarcodeScanner = () => {
    const [showForm, setShowForm] = useState(false);
    const [itemData, setItemData] = useState({ name: "", expiryDate: null });
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
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
        // const user = auth.currentUser;
        const uid = user ? user.uid : null;
        // console.log("UID");
        // console.log(uid);

        Quagga.init(
            {
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector("#barcode-scanner"),
                    constraints: {
                        width: 480,
                        height: 320,
                        facingMode: "environment", // Use the device's rear camera
                        // facingMode: "user", // Use the device's front camera
                    },
                },
                decoder: {
                    readers: ["ean_reader"], // Barcode Format
                },
            },
            (err) => {
                if (err) {
                    console.error("Error initializing Quagga:", err);
                    return;
                }
                Quagga.start();
            }
        );

        Quagga.onDetected(handleBarcodeScan);

        return () => {
            Quagga.stop();
            unsubscribe();
        };
    }, [navigate]);

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

    const handleBarcodeScan = (result) => {
        const barcode = result.codeResult.code;
        console.log("Scanned barcode:", barcode);

        // Process the scanned barcode
        axios
            .get(
                `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
            )
            .then((response) => {
                const productName = response.data.product.product_name;
                const Quant = response.data.product.quantity;
                setItemData({ ...itemData, name: productName + " - " + Quant });
                setShowForm(true); // Open the form
            })
            .catch((error) => {
                console.error("Error retrieving item name:", error);
                setShowForm(true); // Open the manual add item form on error
            });

        // Clear the success message after 5 seconds
        setTimeout(() => {
            setSuccessMessage("");
        }, 5000);
    };

    const handleFormOpen = () => {
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        navigate("/dash");
    };

    const handleFormSubmit = () => {
        // Get the current user's UID from Firebase
        const user = auth.currentUser;
        const uid = user ? user.uid : null;

        // Make a copy of the itemData to avoid modifying the state directly
        const data = { ...itemData, uid: uid };

        // Send a request to the server to add the item
        axios
            .post("https://expirytracker-brain.onrender.com/api/items", data)
            .then(() => {
                setSuccessMessage("Item added successfully!");
                // Reset the form after the API request is completed
                setItemData({
                    name: "",
                    expiryDate: null,
                    comments: "",
                });
            })
            .catch((error) => {
                console.error("Error adding item:", error);
                setSuccessMessage("Error adding item. Please try again.");
            });

        // Clear the success message after 5 seconds
        setTimeout(() => {
            setSuccessMessage("");
        }, 5000);
    };

    const handleSnackbarClose = () => {
        setSuccessMessage("");
    };

    return (
        <div>
            <Navbar />
            <div className="canvas-container">
                <h1>Scan your Product</h1>
                <Box
                    sx={{
                        height: "150px",
                        width: "90%",
                        border: "0px solid #000",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1rem",
                        overflow: "hidden",
                        margin: "0 auto",
                    }}
                >
                    <div id="barcode-scanner"></div>
                </Box>
                <br />
                <Button variant="contained" onClick={handleFormOpen}>
                    Add Item Manually
                </Button>

                <Dialog open={showForm} onClose={handleFormClose}>
                    <DialogTitle>Add Item Manually</DialogTitle>
                    <DialogContent>
                        <br />
                        <TextField
                            label="Item Name"
                            value={itemData.name}
                            onChange={(e) =>
                                setItemData({
                                    ...itemData,
                                    name: e.target.value,
                                })
                            }
                            style={{
                                marginBottom: "1rem",
                            }}
                            inputProps={{ style: { height: "3rem" } }}
                        />
                        <br />
                        <br />
                        <TextField
                            label="Comments"
                            value={itemData.comments}
                            onChange={(e) =>
                                setItemData({
                                    ...itemData,
                                    comments: e.target.value,
                                })
                            }
                            style={{
                                marginBottom: "1rem",
                            }}
                            inputProps={{ style: { height: "3rem" } }}
                        />
                        <br />
                        <br />
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                label="Expiry Date"
                                value={itemData.expiryDate}
                                onChange={(date) =>
                                    setItemData({
                                        ...itemData,
                                        expiryDate: date.toISOString(),
                                    })
                                }
                                format="yyyy-MM-dd"
                                style={{
                                    marginBottom: "1rem",
                                }}
                                inputProps={{ style: { height: "3rem" } }}
                            />
                        </MuiPickersUtilsProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleFormClose}>Cancel</Button>
                        <Button onClick={handleFormSubmit}>Add</Button>
                    </DialogActions>
                </Dialog>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Snackbar
                        open={!!successMessage}
                        autoHideDuration={5000}
                        onClose={handleSnackbarClose}
                    >
                        <Alert
                            onClose={handleSnackbarClose}
                            severity={
                                successMessage.includes("successfully")
                                    ? "success"
                                    : "error"
                            }
                        >
                            {successMessage}
                        </Alert>
                    </Snackbar>
                </MuiPickersUtilsProvider>
            </div>
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

export default BarcodeScanner;
