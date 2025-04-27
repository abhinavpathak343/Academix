import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../../Providers/socket";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import peerService from "../service/peer";
import { Box, Typography, Button, Paper, IconButton, Stack } from "@mui/material";
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';

const Room = () => {
  const socket = useSocket();
  const { roomCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteEmail, setRemoteEmail] = useState("");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const myEmail = location.state?.email || "You";

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
    setRemoteEmail(email);
    socket.emit("user:introduction", { to: id, email: myEmail });
  }, [socket, myEmail]);

  const handleUserIntroduction = useCallback(({ from, email }) => {
    console.log(`Received introduction from ${email}`);
    setRemoteEmail(email);
  }, []);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      peerService.addStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peerService.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    peerService.addStream(stream);
    const offer = await peerService.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      await peerService.setRemoteDescription(ans);
    },
    []
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peerService.getOffer();
    socket.emit("peer:nego:needed", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  const handleNegoIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peerService.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoFinal = useCallback(async ({ ans }) => {
    await peerService.setRemoteDescription(ans);
  }, []);

  const handleIceCandidate = useCallback(({ from, candidate }) => {
    peerService.addIceCandidate(candidate);
  }, []);

  const toggleAudio = useCallback(() => {
    if (myStream) {
      const audioTrack = myStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
    }
  }, [myStream]);

  const toggleVideo = useCallback(() => {
    if (myStream) {
      const videoTrack = myStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  }, [myStream]);

  const handleEndCall = useCallback(() => {
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    peerService.peer.close();
    socket.emit("call:end", { to: remoteSocketId });
    navigate("/Liveclass");
  }, [myStream, remoteStream, remoteSocketId, socket, navigate]);

  const handleCallEnded = useCallback(({ from }) => {
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    peerService.peer.close();
    navigate("/Liveclass");
  }, [myStream, remoteStream, navigate]);

  useEffect(() => {
    if (!socket) return;

    socket.on("user:joined", handleUserJoined);
    socket.on("user:introduction", handleUserIntroduction);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoIncoming);
    socket.on("peer:nego:final", handleNegoFinal);
    socket.on("ice:candidate", handleIceCandidate);
    socket.on("call:end", handleCallEnded);
    socket.on("user:left", handleCallEnded);

    // Emit join room event when component mounts
    socket.emit("room:join", { email: myEmail, room: roomCode });

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("user:introduction", handleUserIntroduction);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoIncoming);
      socket.off("peer:nego:final", handleNegoFinal);
      socket.off("ice:candidate", handleIceCandidate);
      socket.off("call:end", handleCallEnded);
      socket.off("user:left", handleCallEnded);
    };
  }, [
    socket,
    handleUserJoined,
    handleUserIntroduction,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoIncoming,
    handleNegoFinal,
    handleIceCandidate,
    handleCallEnded,
    myEmail,
    roomCode,
  ]);

  useEffect(() => {
    peerService.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    peerService.peer.addEventListener("track", (e) => {
      console.log("Received track:", e);
      setRemoteStream(e.streams[0]);
    });

    // Set up ICE candidate handling
    peerService.setOnIceCandidate((candidate) => {
      socket.emit("ice:candidate", { to: remoteSocketId, candidate });
    });

    return () => {
      peerService.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded, socket, remoteSocketId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        p: 4,
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="h4" sx={{ color: "#1A237E", fontWeight: 700 }}>
        Room: {roomCode}
      </Typography>
      <Typography variant="h6" sx={{ color: "#546E7A" }}>
        {remoteSocketId ? "Connected" : "No one in room"}
      </Typography>
      {remoteSocketId && !myStream && (
        <Button
          variant="contained"
          onClick={handleCallUser}
          sx={{
            backgroundColor: "#1A237E",
            "&:hover": { backgroundColor: "#0D47A1" },
            mb: 2,
          }}
        >
          Start Call
        </Button>
      )}
      
      {myStream && (
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <IconButton 
            onClick={toggleAudio}
            sx={{
              backgroundColor: isAudioEnabled ? "#1A237E" : "#d32f2f",
              color: "white",
              "&:hover": {
                backgroundColor: isAudioEnabled ? "#0D47A1" : "#b71c1c",
              },
            }}
          >
            {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
          <IconButton
            onClick={toggleVideo}
            sx={{
              backgroundColor: isVideoEnabled ? "#1A237E" : "#d32f2f",
              color: "white",
              "&:hover": {
                backgroundColor: isVideoEnabled ? "#0D47A1" : "#b71c1c",
              },
            }}
          >
            {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>
          <IconButton
            onClick={handleEndCall}
            sx={{
              backgroundColor: "#d32f2f",
              color: "white",
              "&:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            <CallEndIcon />
          </IconButton>
        </Stack>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            flex: 1,
            minWidth: "300px",
          }}
        >
          <Typography variant="h5" sx={{ color: "#1A237E" }}>
            {myEmail}
          </Typography>
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              height: "300px",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#e0e0e0",
            }}
          >
            {myStream ? (
              <video
                playsInline
                muted
                ref={(ref) => {
                  if (ref) ref.srcObject = myStream;
                }}
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#666",
                }}
              >
                <VideocamOffIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography>Camera not started</Typography>
              </Box>
            )}
          </Paper>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            flex: 1,
            minWidth: "300px",
          }}
        >
          <Typography variant="h5" sx={{ color: "#1A237E" }}>
            {remoteEmail || "Waiting for participant..."}
          </Typography>
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              height: "300px",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#e0e0e0",
            }}
          >
            {remoteStream ? (
              <video
                playsInline
                ref={(ref) => {
                  if (ref) ref.srcObject = remoteStream;
                }}
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#666",
                }}
              >
                <VideocamOffIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography>Waiting for remote stream...</Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Room;
