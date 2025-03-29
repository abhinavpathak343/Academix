import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const CourseSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
      title: "Web Development",
    },
    {
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
      title: "Machine Learning",
    },
    {
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
      title: "Mobile Development",
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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "450px",
        width: "100%",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={slides[currentIndex].image}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            padding: "20px",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            {slides[currentIndex].title}
          </Typography>
        </motion.div>
      </AnimatePresence>

      {/* Left Arrow */}
      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          top: "50%",
          left: 20,
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.4)",
          color: "black",
          "&:hover": { background: "rgba(255,255,255,0.7)" },
        }}
      >
        <ArrowBackIos />
      </IconButton>

      {/* Right Arrow */}
      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          top: "50%",
          right: 20,
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.4)",
          color: "black",
          "&:hover": { background: "rgba(255,255,255,0.7)" },
        }}
      >
        <ArrowForwardIos />
      </IconButton>

      {/* Progress Bar */}
      <motion.div
        key={currentIndex}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 5 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "4px",
          background: "white",
        }}
      />
    </Box>
  );
};

export default CourseSlideshow;
