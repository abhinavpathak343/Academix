import React, { useState } from "react";
import {
  Box,
  Container,
  Card,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import VideocamIcon from "@mui/icons-material/Videocam";
import PersonIcon from "@mui/icons-material/Person";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

const LiveClass = () => {
  const [email, setEmail] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleJoinRoom = () => {
    // Add room joining logic here
    console.log("Joining room with:", { email, roomCode });
  };

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            background: "linear-gradient(135deg, #F6F9FC 0%, #E9EEF5 100%)",
            borderRadius: "24px",
            p: 4,
            boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Card
            sx={{
              p: 4,
              borderRadius: "16px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
              <VideocamIcon sx={{ fontSize: 40, color: "#1A237E" }} />
              <Typography
                variant="h4"
                sx={{
                  color: "#1A237E",
                  fontWeight: 700,
                }}
              >
                Join Live Class
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <PersonIcon sx={{ mr: 2, color: "#1A237E" }} />
                ),
                style: { color: "#1A237E" },
              }}
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
                  backgroundColor: "#FFFFFF",
                  padding: "0 8px",
                  "&.Mui-focused": {
                    color: "#1A237E",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E3F2FD",
                  borderWidth: "2px",
                },
              }}
            />

            <TextField
              fullWidth
              label="Room Code"
              variant="outlined"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <MeetingRoomIcon sx={{ mr: 2, color: "#1A237E" }} />
                ),
                style: { color: "#1A237E" },
              }}
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
                  backgroundColor: "#FFFFFF",
                  padding: "0 8px",
                  "&.Mui-focused": {
                    color: "#1A237E",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E3F2FD",
                  borderWidth: "2px",
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleJoinRoom}
              sx={{
                backgroundColor: "#1A237E",
                py: 1.5,
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
            >
              Join Room
            </Button>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default LiveClass;