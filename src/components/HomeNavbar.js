import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const HomeNavbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenuOpen}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem
                        component={Link}
                        to="/login"
                        selected={location.pathname === "/login"}
                        onClick={handleMenuClose}
                    >
                        Login
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        to="/signup"
                        selected={location.pathname === "/signup"}
                        onClick={handleMenuClose}
                    >
                        Register
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default HomeNavbar;
