import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config.js";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CourseSlideshow from "./CourseSlideshow";
import CourseCarousel from "./CourseCarousel";
import VideocamIcon from "@mui/icons-material/Videocam";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import LiveTvIcon from "@mui/icons-material/LiveTv";

const CourseLandingPage = () => {
  const navigate = useNavigate();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/courses`);
        // Get only first 3 courses for featured section
        setFeaturedCourses(response.data.courses.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Replace the hardcoded featuredCourses array with the loading and error states
  const renderFeaturedCourses = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#1A237E" }} />
        </Box>
      );
    }

    if (error) {
      return (
        <Typography
          variant="h6"
          sx={{ textAlign: "center", color: "#d32f2f", py: 8 }}
        >
          {error}
        </Typography>
      );
    }

    return (
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {featuredCourses.map((course) => (
          <Grid item xs={12} md={4} key={course._id}>
            <Card
              component={motion.div}
              whileHover={{ y: -10 }}
              sx={{
                backgroundColor: "#FFFFFF",
                height: "100%",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                },
              }}
              onClick={() => navigate("/signin")}
            >
              <CardMedia
                component="img"
                height="200"
                image={course.imageLink || "fallback-image-url"}
                alt={course.title}
                sx={{
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      color: "#1A237E",
                      fontWeight: 600,
                    }}
                  >
                    {course.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#1A237E",
                      fontWeight: 700,
                      backgroundColor: "rgba(26, 35, 126, 0.05)",
                      padding: "4px 12px",
                      borderRadius: "12px",
                    }}
                  >
                    ₹{course.price}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#546E7A",
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  {course.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pt: 2,
                    borderTop: "1px solid #E0E0E0",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 20, color: "#1A237E" }} />
                    <Typography variant="body2" color="#546E7A">
                      {course.duration || "8 weeks"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StarIcon sx={{ color: "#FFC107" }} />
                    <Typography variant="body2" color="#546E7A">
                      {course.rating || "4.5"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SchoolIcon sx={{ color: "#1A237E" }} />
                    <Typography variant="body2" color="#546E7A">
                      {course.students || "500+"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{
          background: "linear-gradient(135deg, #F6F9FC 0%, #E9EEF5 100%)",
          pt: 15,
          pb: 8,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at top right, rgba(26, 35, 126, 0.05) 0%, transparent 70%)",
            zIndex: 0,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "120%",
            height: "120%",
            background:
              "radial-gradient(circle, rgba(26, 35, 126, 0.03) 0%, transparent 60%)",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    color: "#1A237E",
                    letterSpacing: "-0.5px",
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    lineHeight: 1.2,
                    mb: 3,
                  }}
                >
                  Transform Your Skills with Expert-Led Courses
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    color: "#546E7A",
                    lineHeight: 1.6,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  }}
                >
                  Learn from industry experts and advance your career with our
                  comprehensive courses
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "#1A237E",
                      px: 4,
                      py: 2,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontSize: "1.1rem",
                      boxShadow: "0 8px 16px rgba(26, 35, 126, 0.2)",
                      "&:hover": {
                        backgroundColor: "#0D47A1",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 20px rgba(26, 35, 126, 0.3)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => navigate("/explore-courses")}
                  >
                    Explore Courses
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<LiveTvIcon />}
                    sx={{
                      borderColor: "#1A237E",
                      color: "#1A237E",
                      px: 4,
                      py: 2,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontSize: "1.1rem",
                      borderWidth: "2px",
                      "&:hover": {
                        borderColor: "#0D47A1",
                        backgroundColor: "rgba(26, 35, 126, 0.04)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 16px rgba(26, 35, 126, 0.1)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => navigate("/live-classes")}
                  >
                    Live Classes
                  </Button>
                </Box>
              </motion.div>
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
                    borderRadius: "24px",
                    zIndex: 0,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  style={{ position: "relative", zIndex: 1 }}
                >
                  <CourseCarousel />
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Courses Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          align="center"
          sx={{
            color: "#1A237E",
            mb: 6,
          }}
        >
          Featured Courses
        </Typography>
        {renderFeaturedCourses()}
      </Container>

      <Box
        sx={{
          background: "linear-gradient(135deg, #F6F9FC 0%, #E9EEF5 100%)",
          py: 12,
          position: "relative",
          overflow: "hidden",
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <LiveTvIcon sx={{ fontSize: 48, color: "#1A237E", mb: 2 }} />
                <Typography
                  variant="h3"
                  sx={{
                    color: "#1A237E",
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Live Interactive Classes
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#546E7A",
                    mb: 4,
                    lineHeight: 1.8,
                    fontSize: { xs: "1rem", md: "1.1rem" },
                  }}
                >
                  Experience real-time learning with our live classes. Interact
                  directly with expert instructors, participate in discussions,
                  and get immediate feedback on your progress.
                </Typography>
                <Grid container spacing={4}>
                  {[
                    {
                      icon: (
                        <VideocamIcon sx={{ fontSize: 32, color: "#1A237E" }} />
                      ),
                      title: "Live Sessions",
                      description:
                        "Real-time interactive classes with expert instructors",
                    },
                    {
                      icon: (
                        <PeopleIcon sx={{ fontSize: 32, color: "#1A237E" }} />
                      ),
                      title: "Group Learning",
                      description:
                        "Collaborate with peers in live discussion rooms",
                    },
                    {
                      icon: (
                        <ChatIcon sx={{ fontSize: 32, color: "#1A237E" }} />
                      ),
                      title: "Instant Support",
                      description: "Get your questions answered in real-time",
                    },
                  ].map((feature, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box
                        component={motion.div}
                        whileHover={{ y: -5 }}
                        sx={{
                          p: 3,
                          borderRadius: "16px",
                          bgcolor: "white",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                          height: "100%",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        {feature.icon}
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#1A237E",
                            fontWeight: 600,
                            mt: 2,
                            mb: 1,
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#546E7A",
                            lineHeight: 1.6,
                          }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: "#1A237E",
                      px: 4,
                      py: 2,
                      borderRadius: "12px",
                      textTransform: "none",
                      fontSize: "1.1rem",
                      boxShadow: "0 8px 16px rgba(26, 35, 126, 0.2)",
                      "&:hover": {
                        backgroundColor: "#0D47A1",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 20px rgba(26, 35, 126, 0.3)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => navigate("/live-classes")}
                  >
                    Join Live Classes
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <Box
                  sx={{
                    p: 4,
                    borderRadius: "24px",
                    bgcolor: "white",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    height: "100%",
                  }}
                >
                  <SchoolIcon sx={{ fontSize: 48, color: "#1A237E", mb: 2 }} />
                  <Typography
                    variant="h3"
                    sx={{
                      color: "#1A237E",
                      fontWeight: 700,
                      mb: 3,
                      fontSize: { xs: "2rem", md: "2.5rem" },
                    }}
                  >
                    Join as Instructor
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#546E7A",
                      mb: 4,
                      lineHeight: 1.8,
                      fontSize: { xs: "1rem", md: "1.1rem" },
                    }}
                  >
                    Share your expertise with students worldwide. Create
                    engaging courses and build your teaching career with
                    Academix.
                  </Typography>

                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    {[
                      {
                        title: "Create & Upload",
                        description:
                          "Design your course content and upload materials",
                      },
                      {
                        title: "Earn Revenue",
                        description: "Get paid for every student enrollment",
                      },
                      {
                        title: "Support Students",
                        description:
                          "Guide students through their learning journey",
                      },
                    ].map((benefit, index) => (
                      <Grid item xs={12} key={index}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: "12px",
                            bgcolor: "rgba(26, 35, 126, 0.05)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: "rgba(26, 35, 126, 0.08)",
                              transform: "translateX(5px)",
                            },
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#1A237E",
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            {benefit.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#546E7A",
                            }}
                          >
                            {benefit.description}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        backgroundColor: "#1A237E",
                        px: 4,
                        py: 2,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        boxShadow: "0 8px 16px rgba(26, 35, 126, 0.2)",
                        "&:hover": {
                          backgroundColor: "#0D47A1",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 20px rgba(26, 35, 126, 0.3)",
                        },
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => navigate("/adminsignup")}
                    >
                      Become an Instructor
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: "#1A237E",
                        color: "#1A237E",
                        px: 4,
                        py: 2,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontSize: "1.1rem",
                        borderWidth: "2px",
                        "&:hover": {
                          borderColor: "#0D47A1",
                          backgroundColor: "rgba(26, 35, 126, 0.04)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 16px rgba(26, 35, 126, 0.1)",
                        },
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => navigate("/adminsignin")}
                    >
                      Already an Instructor?
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default CourseLandingPage;
