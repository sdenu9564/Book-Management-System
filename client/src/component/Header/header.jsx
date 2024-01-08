import { useState, useContext } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { AccountContext } from "../../context/accountProvider";


export default function Header() {
  const [profile, setProfile] = useState(null);

  const { setAccount } = useContext(AccountContext);

  const handleProfileMenuOpen = (e) => {
    setProfile(e.currentTarget);
  };

  const handleMenuClose = () => {
    setProfile(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("account");
    setAccount(null);
    handleMenuClose();
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ boxShadow: "none" }}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Books
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "flex", md: "flex" } }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Menu
        anchorEl={profile}
        open={Boolean(profile)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        id="primary-search-account-menu"
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        style={{ top: 48 }}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleLogout}>Sign out</MenuItem>
      </Menu>
    </>
  );
}
