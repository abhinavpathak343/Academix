import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../store/atoms/user.js";
import { useState } from "react";

function Appbar() {
  const navigate = useNavigate();
  const user = useRecoilValue(userState); // Get user state from Recoil
  const setUser = useSetRecoilState(userState); // Function to update state

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({ isLoading: false, userEmail: null, token: null }); // Reset user state
    navigate("/signin");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ background: "#FFFFFF", borderBottom: "1px solid #E0E0E0" }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            color: "#1A237E",
            fontWeight: 700,
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Academix
        </Typography>

        {user.token ? (
          <>
            <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
              <Avatar sx={{ bgcolor: "#1A237E", color: "#FFFFFF" }}>
                {user.userEmail ? user.userEmail[0].toUpperCase() : "A"}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
            >
              
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <div style={{ display: "flex", gap: "16px" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/signin")}
              sx={{
                color: "#1A237E",
                borderColor: "#1A237E",
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/signup")}
              sx={{
                background: "#1A237E",
              }}
            >
              Sign Up
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Appbar;
