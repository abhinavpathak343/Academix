import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const CourseCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
      title: "Web Development",
      description: "Master modern web technologies",
    },
    {
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
      title: "Data Science",
      description: "Learn data analysis and ML",
    },
    {
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
      title: "Mobile Development",
      description: "Build iOS and Android apps",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "300px", md: "400px" },
        width: "100%",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 16px 32px rgba(0,0,0,0.1)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7 }}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "24px",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
              padding: { xs: "24px", md: "32px" },
              borderRadius: "0 0 24px 24px",
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  mb: 1,
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                }}
              >
                {slides[currentIndex].title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                }}
              >
                {slides[currentIndex].description}
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      </AnimatePresence>

      <IconButton
        onClick={handlePrevious}
        sx={{
          position: "absolute",
          left: 16,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          "&:hover": {
            backgroundColor: "white",
          },
          zIndex: 2,
        }}
      >
        <ArrowBackIosNewIcon sx={{ color: "#1A237E" }} />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          "&:hover": {
            backgroundColor: "white",
          },
          zIndex: 2,
        }}
      >
        <ArrowForwardIosIcon sx={{ color: "#1A237E" }} />
      </IconButton>

      {/* Slide indicators */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
          zIndex: 2,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor:
                index === currentIndex ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CourseCarousel;
