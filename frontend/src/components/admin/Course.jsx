import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { courseState } from "../../store/atoms/course.js";
import {
  courseTitle,
  coursePrice,
  isCourseLoading,
  courseImage,
} from "../../store/selectors/course.js";
import { BASE_URL } from "../../config.js";
import { Loading } from "./Loading";

function Course() {
  let { courseId } = useParams();
  const setCourse = useSetRecoilState(courseState);
  const courseLoading = useRecoilValue(isCourseLoading);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCourse({ isLoading: false, course: res.data.course });
      })
      .catch(() => {
        setCourse({ isLoading: false, course: null });
      });
  }, [courseId]);

  if (courseLoading) return <Loading />;

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} columns={12}>
            <Grid item xs={12} md={8}>
              <UpdateCard />
            </Grid>
            <Grid item xs={12} md={4}>
              <CourseCard />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

function UpdateCard() {
  const [courseDetails, setCourse] = useRecoilState(courseState);
  const [title, setTitle] = useState(courseDetails.course.title);
  const [description, setDescription] = useState(
    courseDetails.course.description
  );
  const [image, setImage] = useState(courseDetails.course.imageLink);
  const [price, setPrice] = useState(courseDetails.course.price);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const resetFields = () => {
    setTitle(courseDetails.course.title || "");
    setDescription(courseDetails.course.description || "");
    setImage(courseDetails.course.imageLink || "");
    setPrice(courseDetails.course.price || "");
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/courses/${courseDetails.course._id}`,
        {
          title,
          description,
          imageLink: image,
          price,
          published: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the course state with new data
      setCourse({
        course: {
          ...courseDetails.course,
          title,
          description,
          imageLink: image,
          price,
        },
        isLoading: false,
      });

      setSnackbarMessage("Course updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Update text fields with new values
      setTitle(title);
      setDescription(description);
      setImage(image);
      setPrice(price);
    } catch (error) {
      setSnackbarMessage("Failed to update course. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // First, create a common style object for all TextFields
  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      color: "#1A237E", // Add this to fix text color
      borderRadius: "12px",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1A237E",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1A237E",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1A237E",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#546E7A",
      "&.Mui-focused": {
        color: "#1A237E",
      },
    },
    "& .MuiInputBase-input": {
      color: "#1A237E", // This ensures text is visible
    },
  };

  return (
    <>
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        whileHover={{ y: -10 }}
        sx={{
          width: "100%",
          height: "fit-content",
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
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: "#1A237E",
              fontWeight: 700,
              mb: 2,
            }}
          >
            Update Course
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={textFieldStyle}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={textFieldStyle}
            />
            <TextField
              label="Image URL"
              variant="outlined"
              fullWidth
              value={image}
              onChange={(e) => setImage(e.target.value)}
              sx={textFieldStyle}
            />
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              sx={textFieldStyle}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleUpdate}
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
              Update Course
            </Button>
          </Box>
        </Box>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          marginTop: "20px",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
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

function CourseCard() {
  const title = useRecoilValue(courseTitle);
  const imageLink = useRecoilValue(courseImage);
  const price = useRecoilValue(coursePrice);

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      whileHover={{ y: -10 }}
      sx={{
        width: "100%",
        height: "fit-content",
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
          width: "100%",
          height: 200,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box
          component="img"
          src={imageLink}
          alt={title}
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
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x300?text=Course+Image";
            e.target.onerror = null; // Prevents infinite loop if placeholder also fails
          }}
        />
      </Box>

      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#1A237E",
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            backgroundColor: "rgba(26, 35, 126, 0.08)",
            borderRadius: "12px",
            p: 2,
            border: "1px solid rgba(26, 35, 126, 0.12)",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: "#546E7A",
              mb: 1,
            }}
          >
            Course Price
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: "#1A237E",
              fontWeight: 700,
            }}
          >
            ₹{Number(price).toLocaleString("en-IN")}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default Course;
