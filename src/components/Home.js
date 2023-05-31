import React from "react";
import { Container, Typography } from "@mui/material";

const HomePage = () => {
    return (
        <Container
            maxWidth="sm"
            sx={{ textAlign: "center", marginTop: "2rem" }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to the Expiry Tracker!
            </Typography>
            <Typography variant="body1" gutterBottom>
                A MERN application built to help you keep track of your
                perishables.
            </Typography>
        </Container>
    );
};

export default HomePage;
