import { Typography, Button, Grid, Container, Box, Card } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userEmailState } from "../../store/selectors/userEmail.js";
import { isUserLoading } from "../../store/selectors/isUserLoading.js";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const Landing = () => {
  const navigate = useNavigate();
 
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          background: "linear-gradient(135deg, #F6F9FC 0%, #E9EEF5 100%)",
          pt: 15,
          pb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: "#1A237E",
                  letterSpacing: "-0.5px",
                  mb: 2,
                }}
              >
                Academix Admin
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "#546E7A",
                  mb: 4,
                  fontWeight: 500,
                  lineHeight: 1.6,
                }}
              >
                Manage your courses and empower learners in our innovative
                educational ecosystem
              </Typography>
              
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -20,
                    right: -20,
                    bottom: 20,
                    left: 20,
                    background:
                      "linear-gradient(45deg, #F6F9FC 30%, #E9EEF5 90%)",
                    borderRadius: 4,
                    zIndex: 0,
                  },
                }}
              >
                <img
                  src="/2.jpg"
                  alt="Academix"
                  style={{
                    width: "100%",
                    borderRadius: "16px",
                    position: "relative",
                    zIndex: 1,
                    boxShadow: "0 16px 32px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {token && (
        <Container maxWidth="lg" sx={{ mt: -4, mb: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card
                component={motion.div}
                whileHover={{ y: -10 }}
                sx={{
                  p: 4,
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    background:
                      "linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)",
                  },
                }}
                onClick={() => navigate("/addcourse")}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: "rgba(26, 35, 126, 0.05)",
                      mr: 2,
                    }}
                  >
                    <AddCircleIcon sx={{ fontSize: 40, color: "#1A237E" }} />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#1A237E",
                      fontWeight: 700,
                    }}
                  >
                    Add Course
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#546E7A",
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                  }}
                >
                  Create and publish new courses for your students
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                component={motion.div}
                whileHover={{ y: -10 }}
                sx={{
                  p: 4,
                  borderRadius: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    background:
                      "linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)",
                  },
                }}
                onClick={() => navigate("/courses")}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      backgroundColor: "rgba(26, 35, 126, 0.05)",
                      mr: 2,
                    }}
                  >
                    <LibraryBooksIcon sx={{ fontSize: 40, color: "#1A237E" }} />
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: "#1A237E",
                      fontWeight: 700,
                    }}
                  >
                    My Courses
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#546E7A",
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                  }}
                >
                  Manage and update your existing courses
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default Landing;
