import {
  Box,
  Container,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config.js";
import { motion } from "framer-motion";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";

function AddCourse() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${BASE_URL}/admin/courses`,
        {
          title,
          description,
          imageLink: image,
          published: true,
          price,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setOpen(true);
      setTimeout(() => {
        navigate("/courses");
      }, 2000);
    } catch (error) {
      alert("Failed to add course. Please try again.");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="md">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
            <AddCircleIcon sx={{ fontSize: 40, color: "#1A237E" }} />
            <Typography
              variant="h3"
              sx={{
                color: "#1A237E",
                fontWeight: 700,
              }}
            >
              Create New Course
            </Typography>
          </Box>

          <Card
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            sx={{
              p: 4,
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
              background: "linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%)",
            }}
          >
            <TextField
              fullWidth
              label="Course Title"
              variant="outlined"
              onChange={(e) => setTitle(e.target.value)}
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
                  "&.Mui-focused": {
                    color: "#1A237E",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Course Description"
              variant="outlined"
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  transition: "all 0.3s ease-in-out",
                  "& textarea": { color: "#1A237E" },
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
                  "&.Mui-focused": {
                    color: "#1A237E",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Image URL"
              variant="outlined"
              onChange={(e) => setImage(e.target.value)}
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
                  "&.Mui-focused": {
                    color: "#1A237E",
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Course Price"
              type="number"
              variant="outlined"
              onChange={(e) => setPrice(e.target.value)}
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
                  "&.Mui-focused": {
                    color: "#1A237E",
                  },
                },
              }}
            />

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleSubmit}
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
              }}
            >
              Create Course
            </Button>

            <Snackbar
              open={open}
              autoHideDuration={2000}
              onClose={handleClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{
                  width: "100%",
                  bgcolor: "#E8EAF6", // Lighter background color
                  color: "#1A237E", // Dark blue text
                  border: "1px solid #1A237E",
                  "& .MuiAlert-icon": {
                    color: "#1A237E",
                  },
                  "& .MuiAlert-action": {
                    color: "#1A237E",
                  },
                  fontSize: "1rem",
                  fontWeight: 500,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(26, 35, 126, 0.15)",
                }}
              >
                Course added successfully!
              </Alert>
            </Snackbar>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default AddCourse;
