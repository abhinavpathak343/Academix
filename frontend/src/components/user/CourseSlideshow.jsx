import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";

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
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: "400px",
        width: "100%",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={slides[currentIndex].image}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
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
          }}
        >
          <h3>{slides[currentIndex].title}</h3>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default CourseSlideshow;
