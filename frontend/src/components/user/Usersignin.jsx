import {
  Box,
  Container,
  Card,
  Typography,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { userState } from "../../store/atoms/user.js";
import { useGoogleLogin } from "@react-oauth/google";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import InputAdornment from "@mui/material/InputAdornment";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";
import { BASE_URL } from "../../config.js";

function UserSignin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          { headers: { Authorization: `Bearer ${response.access_token}` } }
        );

        const { email, name, id } = userInfoResponse.data;

        try {
          // Try login first
          const loginResponse = await axios.post(`${BASE_URL}/google-auth`, {
            email,
            name,
            googleId: id,
            operation: "login",
          });
          localStorage.setItem("token", loginResponse.data.token);
          setUser({
            userEmail: email,
            username: name,
            token: loginResponse.data.token,
            isAdmin: false,
            isLoading: false,
          });
          navigate("/userhome");
        } catch (loginError) {
          // If user not found, try signup
          if (
            loginError.response &&
            loginError.response.data &&
            loginError.response.data.message === "User not found"
          ) {
            try {
              const signupResponse = await axios.post(`${BASE_URL}/google-auth`, {
                email,
                name,
                googleId: id,
                operation: "signup",
              });
              localStorage.setItem("token", signupResponse.data.token);
              setUser({
                userEmail: email,
                username: name,
                token: signupResponse.data.token,
                isAdmin: false,
                isLoading: false,
              });
              navigate("/userhome");
            } catch (signupError) {
              // Handle signup error (e.g., user already exists with different Google ID)
              setError(
                signupError.response && signupError.response.data && signupError.response.data.message
                  ? signupError.response.data.message
                  : "Google sign-in failed. Please try again."
              );
              setOpen(true);
              console.error("Google Signup Error:", signupError.response || signupError.message);
            }
          } else {
            // Handle other login errors
            setError(
              loginError.response && loginError.response.data && loginError.response.data.message
                ? loginError.response.data.message
                : "Google sign-in failed. Please try again."
            );
            setOpen(true);
            console.error("Google Login Error:", loginError.response || loginError.message);
          }
        }
      } catch (error) {
        setError("Google sign-in failed. Please try again.");
        setOpen(true);
        console.error("Google Login Error:", error.response || error.message);
      }
    },
    onError: (error) => {
      setError("Google sign-in failed. Please try again.");
      setOpen(true);
      console.error("Google Login Error:", error);
    },
  });

  const handleSignin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser({
          isLoading: false,
          token: response.data.token,
          isAdmin: false,
          userEmail: username, // Change this to store username for avatar display
        });
        navigate("/userhome");
      }
    } catch (error) {
      setError(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Invalid username or password."
      );
      setOpen(true);
      console.error(
        "Signin error:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

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
                sx={{
                  color: "#1A237E",
                  fontWeight: 700,
                }}
              >
                Welcome Back
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#1A237E" }} />
                  </InputAdornment>
                ),
                style: { color: "#1A237E" },
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  transition: "all 0.3s ease-in-out",
                  "& input": { color: "#1A237E" },
                  "&:hover fieldset": {
                    borderColor: "#90CAF9",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1A237E",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#546E7A",
                  backgroundColor: "#FFFFFF",
                  padding: "0 8px",
                  "&.Mui-focused": {
                    color: "#1A237E",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E3F2FD",
                  borderWidth: "2px",
                },
              }}
            />

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
                      sx={{
                        color: "#1A237E",
                        "&:hover": {
                          backgroundColor: "rgba(26, 35, 126, 0.04)",
                        },
                      }}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                style: { color: "#1A237E" },
              }}
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  transition: "all 0.3s ease-in-out",
                  "& input": { color: "#1A237E" },
                  "&:hover fieldset": {
                    borderColor: "#90CAF9",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1A237E",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#546E7A",
                  backgroundColor: "#FFFFFF",
                  padding: "0 8px",
                  "&.Mui-focused": {
                    color: "#1A237E",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E3F2FD",
                  borderWidth: "2px",
                },
              }}
            />

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleSignin}
              sx={{
                backgroundColor: "#1A237E",
                borderRadius: "12px",
                py: 1.5,
                textTransform: "none",
                fontSize: "1.1rem",
                boxShadow: "0 8px 16px rgba(26, 35, 126, 0.2)",
                "&:hover": {
                  backgroundColor: "#0D47A1",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 20px rgba(26, 35, 126, 0.3)",
                },
                transition: "all 0.3s ease",
                mb: 2,
              }}
            >
              Sign in
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" sx={{ color: "#546E7A" }}>
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={googleLogin}
              sx={{
                borderColor: "#1A237E",
                color: "#1A237E",
                borderRadius: "12px",
                py: 1.5,
                textTransform: "none",
                fontSize: "1.1rem",
                "&:hover": {
                  borderColor: "#0D47A1",
                  backgroundColor: "rgba(26, 35, 126, 0.04)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
              startIcon={
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  style={{ width: 20, height: 20 }}
                />
              }
            >
              Sign in with Google
            </Button>

            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: "1px solid #E0E0E0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <Typography variant="body2" sx={{ color: "#546E7A" }}>
                Don't have an account?
              </Typography>
              <Button
                component={Link}
                to="/usersignup"
                sx={{
                  color: "#1A237E",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "rgba(26, 35, 126, 0.04)",
                  },
                }}
              >
                Create Account
              </Button>
            </Box>
          </Card>
        </Box>
      </Container>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UserSignin;
