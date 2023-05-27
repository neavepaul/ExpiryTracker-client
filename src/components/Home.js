import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <Container
            maxWidth="sm"
            sx={{ textAlign: "center", marginTop: "2rem" }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to the Home Page!
            </Typography>
            <Typography variant="body1" gutterBottom>
                Add your contents and icons here.
            </Typography>
            <Button
                variant="contained"
                component={Link}
                to="/scan"
                sx={{ marginTop: "2rem" }}
            >
                Go to Barcode Scanner
            </Button>
        </Container>
    );
};

export default HomePage;
