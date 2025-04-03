import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/atoms/user";
import axios from "axios";
import { BASE_URL } from "../../config";
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

function CourseDescription() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/course/${courseId}`);
        setCourse(response.data.course);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Failed to load course details");
        setLoading(false);
      }
    };

    if (user.isAdmin) {
      navigate("/usersignin");
      return;
    }

    fetchCourse();
  }, [courseId, user.isAdmin, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#1A237E" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#F6F9FC", minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ py: 8 }}>
        {" "}
        {/* Changed from lg to md */}
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            background: "#FFFFFF",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
          }}
        >
          <Grid container>
            {/* Course Image */}
            <Grid item xs={12}>
              <Box sx={{ position: "relative", paddingTop: "45%" }}>
                {" "}
                {/* Reduced height */}
                <Box
                  component="img"
                  src={course?.imageLink || "fallback-image-url"}
                  alt={course?.title}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>

            {/* Course Details */}
            <Grid item xs={12}>
              <Box sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  sx={{ color: "#1A237E", fontWeight: 700, mb: 2 }}
                >
                  {course?.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ color: "#546E7A", lineHeight: 1.8, mb: 3 }}
                >
                  {course?.description}
                </Typography>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={4}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon sx={{ color: "#1A237E" }} />
                      <Typography variant="body2" color="#546E7A">
                        {course?.duration || "8 weeks"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <StarIcon sx={{ color: "#FFC107" }} />
                      <Typography variant="body2" color="#546E7A">
                        {course?.rating || "4.5"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <SchoolIcon sx={{ color: "#1A237E" }} />
                      <Typography variant="body2" color="#546E7A">
                        {course?.students || "500+"} students
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ color: "#1A237E", fontWeight: 700 }}
                  >
                    ₹{course?.price}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<PlayCircleOutlineIcon />}
                    sx={{
                      backgroundColor: "#1A237E",
                      px: 4,
                      py: 1.5,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontSize: "1rem",
                      boxShadow: "0 8px 16px rgba(26, 35, 126, 0.2)",
                      "&:hover": {
                        backgroundColor: "#0D47A1",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 20px rgba(26, 35, 126, 0.3)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Enroll Now
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}

export default CourseDescription;
