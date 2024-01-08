import { useState, useContext } from "react";
import {
  Box,
  styled,
  alpha,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  MenuItem,
  Menu,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { AccountContext } from "../../context/accountProvider";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Header({ onSearchResults }) {
  const [profile, setProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const { account, setAccount } = useContext(AccountContext);

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
