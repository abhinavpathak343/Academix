import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config.js";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);

  const handleCourseDelete = (deletedCourseId) => {
    setCourses(courses.filter((course) => course._id !== deletedCourseId));
  };

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
                <Course
                  course={course}
                  delay={index * 0.1}
                  onDelete={handleCourseDelete}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export function Course({ course, delay, onDelete }) {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false);
  };

  const handleDeleteConfirm = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${BASE_URL}/admin/course/${course._id}`, // Note: changed 'courses' to 'course'
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("Course deleted successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        onDelete(course._id);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setSnackbarMessage(
        error.response?.status === 404
          ? "Course not found"
          : "Failed to delete course. Please try again."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsDeleting(false);
      setOpenDialog(false);
    }
  };

  return (
    <>
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8 }}
        whileHover={{ y: -10 }}
        sx={{
          width: "100%",
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
            flexGrow: 1,
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
              flexGrow: 1,
            }}
          >
            {course.description}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
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
              }}
            >
              Edit Course
            </Button>

            <Button
              variant="contained"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              sx={{
                backgroundColor: "#d32f2f",
                borderRadius: "12px",
                minWidth: "50px",
                py: 1.5,
                boxShadow: "0 8px 16px rgba(211, 47, 47, 0.2)",
                "&:hover": {
                  backgroundColor: "#b71c1c",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 20px rgba(211, 47, 47, 0.3)",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
                transition: "all 0.3s ease",
              }}
            >
              <DeleteIcon />
            </Button>
          </Box>
        </Box>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 20px 50px rgba(26, 35, 126, 0.1)",
            maxWidth: "450px",
            width: "100%",
            background: "linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#d32f2f",
            color: "white",
            py: 2.5,
            px: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            backgroundImage: "linear-gradient(to right, #d32f2f, #b71c1c)",
          }}
        >
          <DeleteIcon sx={{ fontSize: 24 }} />
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 600,
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Delete Course
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            background: "linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%)",
          }}
        >
          <Box
            sx={{
              p: 3,
              background: "rgba(255,255,255,0.7)",
              borderBottom: "1px solid rgba(26, 35, 126, 0.1)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#546E7A",
                mb: 1,
                fontWeight: 500,
              }}
            >
              You are about to delete:
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#1A237E",
                fontWeight: 700,
                mb: 2,
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              "{course.title}"
            </Typography>
            <Typography
              sx={{
                color: "#546E7A",
                lineHeight: 1.6,
              }}
            >
              This action cannot be undone. Are you sure you want to proceed?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            pt: 2,
            gap: 2,
            background: "linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%)",
            borderTop: "1px solid rgba(26, 35, 126, 0.1)",
          }}
        >
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              borderColor: "#546E7A",
              color: "#546E7A",
              borderRadius: "12px",
              px: 3,
              py: 1,
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#1A237E",
                backgroundColor: "rgba(26, 35, 126, 0.08)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? null : <DeleteIcon />}
            sx={{
              backgroundColor: "#d32f2f",
              backgroundImage: "linear-gradient(to right, #d32f2f, #b71c1c)",
              borderRadius: "12px",
              px: 3,
              py: 1,
              transition: "all 0.3s ease",
              boxShadow: "0 8px 16px rgba(211, 47, 47, 0.2)",
              "&:hover": {
                backgroundColor: "#b71c1c",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 20px rgba(211, 47, 47, 0.3)",
              },
              "&:disabled": {
                backgroundColor: "#ccc",
                backgroundImage: "none",
              },
            }}
          >
            {isDeleting ? "Deleting..." : "Delete Course"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          marginTop: "20px",
        }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: "100%",
            backgroundColor:
              snackbarSeverity === "success" ? "#1A237E" : "#d32f2f",
            color: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            "& .MuiAlert-icon": {
              color: "white",
            },
            "& .MuiAlert-action": {
              color: "white",
            },
            fontSize: "1rem",
            alignItems: "center",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Courses;
