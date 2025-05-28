import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import {
  createServer
} from 'http'; // Add this import
import {
  Server
} from 'socket.io';
import connectDB from './db/index.js';
import adminRouter from './routes/admin.js';
import userRouter from './routes/user.js';
import {
  User
} from './db/index.js';
import {
  SECRET
} from './middleware/auth.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

connectDB();

const app = express();
const server = createServer(app); // Create HTTP server

// Configure CORS for Express
app.use(cors({
  origin: [
    'http://localhost:5174',
    'https://academix-oz6b.vercel.app',
   'https://academixnew.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const io = new Server(server, { // Initialize Socket.IO with HTTP server
  cors: {
    origin: [
      'http://localhost:5174',
      'https://academix-oz6b.vercel.app',
      'https://academixnew.onrender.com'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(express.json());
app.use(bodyParser.json());
app.use('/admin', adminRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.status(200).send('Backend is running!');
});

// ✅ Google Authentication Route
app.post('/google-auth', async (req, res) => {
  const {
    email,
    name,
    googleId,
    operation
  } = req.body;

  try {
    let user = await User.findOne({
      email
    });

    if (operation === "signup") {
      if (user) {
        return res.status(400).json({
          message: "User already exists"
        });
      }
      user = new User({
        username: name,
        email,
        googleId,
        purchasedCourses: []
      });
      await user.save();
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Generate JWT Token
    const token = jwt.sign({
      id: user._id,
      email: user.email
    }, SECRET, {
      expiresIn: "24h"
    });

    res.json({
      token,
      user: {
        email: user.email,
        username: user.username,
        id: user._id
      }
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);

  socket.on("room:join", (data) => {
    const {
      email,
      room
    } = data;
    console.log(`User ${email} joining room ${room}`);

    // Join the socket room
    socket.join(room);

    // Notify others in the room
    socket.to(room).emit("user:joined", {
      email,
      id: socket.id
    });

    // Confirm to the joining user
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:introduction", ({
    to,
    email
  }) => {
    io.to(to).emit("user:introduction", {
      from: socket.id,
      email
    });
  });

  socket.on('user:call', ({
    to,
    offer
  }) => {
    io.to(to).emit('incoming:call', {
      from: socket.id,
      offer
    });
  });

  socket.on('call:accepted', ({
    to,
    ans
  }) => {
    io.to(to).emit('call:accepted', {
      from: socket.id,
      ans
    });
  });

  socket.on('peer:nego:needed', ({
    to,
    offer
  }) => {
    io.to(to).emit('peer:nego:needed', {
      from: socket.id,
      offer
    });
  });

  socket.on('peer:nego:done', ({
    to,
    ans
  }) => {
    io.to(to).emit('peer:nego:final', {
      from: socket.id,
      ans
    });
  });

  socket.on('ice:candidate', ({
    to,
    candidate
  }) => {
    io.to(to).emit('ice:candidate', {
      from: socket.id,
      candidate
    });
  });

  socket.on('call:end', ({
    to
  }) => {
    io.to(to).emit('call:end', {
      from: socket.id
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Notify all rooms this socket was in about the disconnection
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.to(room).emit('user:left', {
          id: socket.id
        });
      }
    });
  });
});

const PORT = process.env.PORT || 9010;

// Update the server startup
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});