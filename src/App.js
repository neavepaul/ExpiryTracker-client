import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Home from "./components/Home";
import LoginPage from "./components/Login";
import Signup from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import BarcodeScanner from "./components/BarcodeScanner";
import Expired from "./components/Expired";

const theme = createTheme({
    palette: {
        primary: {
            main: "#2196f3",
        },
        secondary: {
            main: "#f50057",
        },
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dash" element={<Dashboard />} />
                    <Route path="/expire" element={<Expired />} />
                    <Route path="/scan" element={<BarcodeScanner />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
