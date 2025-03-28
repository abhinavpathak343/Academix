import { Box, Container, Grid, Card, Typography, Button, TextField } from "@mui/material";
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

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        background: "linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%)",
        p: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "#1A237E",
          fontWeight: 700,
          mb: 3,
        }}
      >
        Update Course Details
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          InputProps={{
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1A237E',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1A237E',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1A237E',
              },
            }
          }}
          InputLabelProps={{
            sx: {
              color: '#1A237E',
              '&.Mui-focused': {
                color: '#1A237E',
              },
            }
          }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          InputProps={{
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1A237E',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1A237E',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1A237E',
              },
            }
          }}
          InputLabelProps={{
            sx: {
              color: '#1A237E',
              '&.Mui-focused': {
                color: '#1A237E',
              },
            }
          }}
        />
        <TextField
          label="Image URL"
          variant="outlined"
          fullWidth
          value={image}
          onChange={(e) => setImage(e.target.value)}
          InputProps={{
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1A237E',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1A237E',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1A237E',
              },
            }
          }}
          InputLabelProps={{
            sx: {
              color: '#1A237E',
              '&.Mui-focused': {
                color: '#1A237E',
              },
            }
          }}
        />
        <TextField
          label="Price"
          variant="outlined"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          InputProps={{
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1A237E',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1A237E',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1A237E',
              },
            }
          }}
          InputLabelProps={{
            sx: {
              color: '#1A237E',
              '&.Mui-focused': {
                color: '#1A237E',
              },
            }
          }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={async () => {
            await axios.put(
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
          }}
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
    </Card>
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
          src={imageLink || "/api/placeholder/400/320"}
          alt={title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/api/placeholder/400/320";
          }}
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
          {title}
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
          Price: <b>Rs {price}</b>
        </Typography>
      </Box>
    </Card>
  );
}

export default Course;