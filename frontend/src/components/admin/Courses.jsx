import { Box, Container, Grid, Card, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config.js";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);

  const init = async () => {
    const response = await axios.get(`${BASE_URL}/admin/courses/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setCourses(response.data.courses);
  };

  useEffect(() => {
    init();
  }, []);

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
              My Courses
            </Typography>
          </Box>

          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            alignItems="stretch"
            sx={{ minHeight: "100%" }}
          >
            {courses.map((course, index) => (
              <Grid
                item
                xs={4}
                sm={4}
                md={4}
                key={course._id}
                sx={{
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                <Course course={course} delay={index * 0.1} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export function Course({ course, delay }) {
  const navigate = useNavigate();

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      whileHover={{ y: -10 }}
      sx={{
        width: "100%", // Add this to make card take full width of grid item
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        background: "linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          background: "linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          paddingTop: "56.25%", // 16:9 aspect ratio
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={course.imageLink}
          alt={course.title}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />
      </Box>

      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1, // This makes the content box fill remaining space
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#1A237E",
            fontWeight: 700,
            mb: 1,
          }}
        >
          {course.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#546E7A",
            mb: 3,
            lineHeight: 1.6,
            flexGrow: 1, // This pushes the button to the bottom
          }}
        >
          {course.description}
        </Typography>
        <Button
          fullWidth
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate("/course/" + course._id)}
          sx={{
            backgroundColor: "#1A237E",
            borderRadius: "12px",
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 8px 16px rgba(26, 35, 126, 0.2)",
            "&:hover": {
              backgroundColor: "#0D47A1",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 20px rgba(26, 35, 126, 0.3)",
            },
            transition: "all 0.3s ease",
            mt: "auto", // Ensures button sticks to bottom
          }}
        >
          Edit Course
        </Button>
      </Box>
    </Card>
  );
}

export default Courses;
