import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config.js";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const ExploreCoursesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/courses`);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: "100vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
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
          minHeight: "100vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "#d32f2f" 
        }}
      >
        <Typography variant="h5">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 6, gap: 2 }}>
            <LibraryBooksIcon sx={{ fontSize: 40, color: "#1A237E" }} />
            <Typography
              variant="h3"
              sx={{
                color: "#1A237E",
                fontWeight: 700,
              }}
            >
              Explore Courses
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 6 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#1A237E" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "#F6F9FC",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1A237E",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1A237E",
                  },
                },
              }}
            />
          </Box>

          {/* Courses Grid */}
          <Grid container spacing={4}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
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
                          {course.duration}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <StarIcon sx={{ color: "#FFC107" }} />
                        <Typography variant="body2" color="#546E7A">
                          {course.rating}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <SchoolIcon sx={{ color: "#1A237E" }} />
                        <Typography variant="body2" color="#546E7A">
                          {course.students}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ExploreCoursesPage;