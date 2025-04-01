import React, { useState } from "react";
import {
  Box,
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../../store/atoms/user.js";
import { useGoogleLogin } from "@react-oauth/google";
import SchoolIcon from "@mui/icons-material/School";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../config.js";

function UserSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);

  // ✅ Extracted handleSignup function (same as AdminSignup)
  const handleSignup = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/user/signup`, {
        username: email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser({
          userEmail: email,
          token: response.data.token,
          isAdmin: false, // ✅ Ensuring user is not admin
          isLoading: false,
        });
        navigate("/userhome");
      }
    } catch (error) {
      console.error(
        "Signup error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // ✅ Google Signup (unchanged)
  const googleSignup = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          { headers: { Authorization: `Bearer ${response.access_token}` } }
        );

        const { email, name, id } = userInfoResponse.data;

        const authResponse = await axios.post(`${BASE_URL}/google-auth`, {
          email,
          name,
          googleId: id,
          operation: "signup",
        });

        localStorage.setItem("token", authResponse.data.token);
        setUser({
          userEmail: email,
          token: authResponse.data.token,
          isAdmin: false, // ✅ Ensuring user is not admin for Google signup
          isLoading: false,
        });
        navigate("/userhome");
      } catch (error) {
        console.error("Google Signup Error:", error.response || error.message);
      }
    },
    onError: (error) => {
      console.error("Google Signup Error:", error);
    },
  });

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            background: "linear-gradient(135deg, #F6F9FC 0%, #E9EEF5 100%)",
            borderRadius: "24px",
            p: 4,
            boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Card
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            sx={{
              p: 4,
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
              background: "#FFFFFF",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
              <SchoolIcon sx={{ fontSize: 40, color: "#1A237E" }} />
              <Typography
                variant="h4"
                sx={{ color: "#1A237E", fontWeight: 700 }}
              >
                Join Academix
              </Typography>
            </Box>

            {/* Email Field */}
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#1A237E" }} />
                  </InputAdornment>
                ),
                style: { color: "#1A237E" },
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  "& input": { color: "#1A237E" },
                  "&:hover fieldset": { borderColor: "#90CAF9" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1A237E",
                    borderWidth: "2px",
                  },
                },
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#1A237E" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#1A237E" }}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  "& input": { color: "#1A237E" },
                  "&:hover fieldset": { borderColor: "#90CAF9" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1A237E",
                    borderWidth: "2px",
                  },
                },
              }}
            />

            {/* Signup Button */}
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleSignup} // ✅ Uses extracted function
              sx={{ mb: 2, background: "#1A237E" }}
            >
              Create Account
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" sx={{ color: "#546E7A" }}>
                OR
              </Typography>
            </Divider>

            {/* Google Signup */}
            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={googleSignup}
              sx={{
                borderColor: "#1A237E",
                color: "#1A237E",
                borderRadius: "12px",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(26, 35, 126, 0.1)" },
              }}
            >
              Sign up with Google
            </Button>

            {/* Link to Login */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Typography variant="body2">Already have an account?</Typography>
              <Button
                component={Link}
                to="/signin"
                sx={{ color: "#1A237E", fontWeight: 600 }}
              >
                Login
              </Button>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default UserSignup;
