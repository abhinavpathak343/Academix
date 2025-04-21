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
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { useSocket } from "../../Providers/socket"; // Adjust the import path as necessary

const LiveClass = () => {
  const [email, setEmail] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmit = useCallback(() => {
    // Add validation
    if (!email || !roomCode) {
      alert("Please enter both email and room code");
      return;
    }

    // Emit the join room event
    socket.emit("room:join", { email, room: roomCode });
  }, [socket, email, roomCode]);

  useEffect(() => {
    if (!socket) return;

    socket.on("room:join", (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`, { state: { email } });
    });

    return () => {
      socket.off("room:join");
    };
  }, [socket, navigate]);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F5F5",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#1A237E",
              fontWeight: 700,
              mb: 2,
            }}
          >
            Join Live Class
          </Typography>
          <Typography variant="h6" sx={{ color: "#546E7A" }}>
            Connect with your peers in real-time
          </Typography>
        </Box>

        <Card
          sx={{
            p: 4,
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            backgroundColor: "#FFFFFF",
          }}
        >
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <PersonIcon sx={{ mr: 2, color: "#1A237E" }} />,
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
            onClick={handleSubmit}
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
      </Container>
    </Box>
  );
};

export default LiveClass;
