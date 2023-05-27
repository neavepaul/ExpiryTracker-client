import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomePage from "./components/Home";
import BarcodeScanner from "./components/BarcodeScanner";
import LoginPage from "./components/Login";
import Dashboard from "./components/Dashboard";

const theme = createTheme();

const App = () => {
    // const isLoggedIn = false;

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/scan" element={<BarcodeScanner />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dash" element={<Dashboard />} />
                </Routes>
            </Router>
        </ThemeProvider>
        // <ThemeProvider theme={theme}>
        //     <Router>
        //         <Routes>
        //             <Route path="/" element={<LoginPage />} />
        //             {isLoggedIn ? (
        //                 <>
        //                     <Route path="/home" element={<HomePage />} />
        //                     <Route path="/scan" element={<BarcodeScanner />} />
        //                 </>
        //             ) : (
        //                 <>
        //                     <Route>
        //                         <Navigate to="/login" />
        //                     </Route>
        //                 </>
        //             )}
        //         </Routes>
        //     </Router>
        // </ThemeProvider>
    );
};

export default App;
