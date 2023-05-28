import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

const Dashboard = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Fetch items from the server
        axios
            .get("http://localhost:5000/api/items")
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                console.error("Error retrieving items:", error);
            });
    }, []);

    // Sort items by expiry date (closest to furthest)
    const sortedItems = items.sort((a, b) => {
        const expiryDateA = new Date(a.expiryDate);
        const expiryDateB = new Date(b.expiryDate);
        return expiryDateA - expiryDateB;
    });

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Item Name</TableCell>
                        <TableCell>Comments</TableCell>
                        <TableCell>Expiry Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedItems.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.comments}</TableCell>
                            <TableCell>{item.expiryDate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Dashboard;
