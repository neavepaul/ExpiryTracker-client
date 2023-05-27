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

const BarcodeScanner = () => {
    const [showForm, setShowForm] = useState(false);
    const [itemData, setItemData] = useState({ name: "", expiryDate: "" });
    const [successMessage, setSuccessMessage] = useState("");

    const handleBarcodeScan = (result) => {
        const barcode = result.codeResult.code;
        console.log("Scanned barcode:", barcode);
        // Process the scanned barcode
        // Send a request to the server
        axios
            .post("/api/item", {
                barcode,
                name: itemData.name,
                expiryDate: itemData.expiryDate,
            })
            .then(() => {
                setSuccessMessage("Item added successfully!");
                // Reset the form
                setItemData({ name: "", expiryDate: "" });
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

    useEffect(() => {
        Quagga.init(
            {
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector("#barcode-scanner"),
                    constraints: {
                        width: 480,
                        height: 320,
                        // facingMode: "environment", // Use the device's rear camera
                        facingMode: "user", // Use the device's front camera
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
        };
    }, []);

    const handleFormOpen = () => {
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
    };

    const handleFormSubmit = () => {
        // Make a copy of the itemData to avoid modifying the state directly
        const data = { ...itemData };

        // Send a request to the server to add the item
        axios
            .post("http://localhost:5000/api/items", data)
            .then(() => {
                setSuccessMessage("Item added successfully!");
                // Reset the form after the API request is completed
                setItemData({ name: "", expiryDate: "", barcode: "" });
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
            <h1>Barcode Scanner App</h1>
            <div id="barcode-scanner"></div>

            <Button variant="contained" onClick={handleFormOpen}>
                Add Item Manually
            </Button>

            <Dialog open={showForm} onClose={handleFormClose}>
                <DialogTitle>Add Item Manually</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Item Name"
                        value={itemData.name}
                        onChange={(e) =>
                            setItemData({
                                ...itemData,
                                name: e.target.value,
                                barcode: "1111111111111",
                            })
                        }
                    />
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
                    <Alert onClose={handleSnackbarClose} severity="success">
                        {successMessage}
                    </Alert>
                </Snackbar>
            </MuiPickersUtilsProvider>
        </div>
    );
};

export default BarcodeScanner;
