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
  const user = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);

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
    setUser({ isLoading: false, userEmail: null, token: null, isAdmin: false }); // ✅ Reset user state
    navigate(user.isAdmin ? "/adminsignin" : "/usersignin"); // ✅ Corrected route for user sign-in
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ background: "#FFFFFF", borderBottom: "1px solid #E0E0E0" }}
    >
      <Toolbar>
        {/* Dynamic Navigation for Home */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            color: "#1A237E",
            fontWeight: 700,
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          onClick={() => navigate(user.isAdmin ? "/adminhome" : "/userhome")} // ✅ Dynamic navigation
        >
          Academix
        </Typography>

        {user.token ? (
          <>
            <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
              <Avatar sx={{ bgcolor: "#1A237E", color: "#FFFFFF" }}>
                {user.username
                  ? user.username[0].toUpperCase()
                  : user.userEmail
                  ? user.userEmail[0].toUpperCase()
                  : ""}
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
            {/* Dynamic Navigation for Sign In/Sign Up */}
            <Button
              variant="outlined"
              onClick={() =>
                navigate(user.isAdmin ? "/adminsignin" : "/usersignin")
              } // ✅ Corrected
              sx={{ color: "#1A237E", borderColor: "#1A237E" }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                navigate(user.isAdmin ? "/adminsignup" : "/usersignup")
              } // ✅ Corrected
              sx={{ background: "#1A237E" }}
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
