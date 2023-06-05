import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
import {
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundColor: theme.palette.primary.main,
    },
    title: {
        color: theme.palette.text.primary,
        flexGrow: 1,
        textAlign: "center",
    },
}));

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();
    const classes = useStyles();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" className={classes.appBar}>
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
                        to="/dash"
                        selected={location.pathname === "/dash"}
                        onClick={handleMenuClose}
                    >
                        Dashboard
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        to="/scan"
                        selected={location.pathname === "/scan"}
                        onClick={handleMenuClose}
                    >
                        Add Items
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        to="/expire"
                        selected={location.pathname === "/expire"}
                        onClick={handleMenuClose}
                    >
                        Expired Items
                    </MenuItem>
                    {/* <MenuItem
                        component={Link}
                        to="/profile"
                        selected={location.pathname === "/profile"}
                        onClick={handleMenuClose}
                    >
                        <AccountCircleIcon />
                        Profile
                    </MenuItem> */}
                </Menu>
                <Typography variant="h6" className={classes.title}>
                    Expiry Tracker
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
