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

connectDB();

const app = express();
const server = createServer(app); // Create HTTP server
const io = new Server(server, { // Initialize Socket.IO with HTTP server
  cors: {
    origin: "http://localhost:5173", // Add your frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/admin', adminRouter);
app.use('/user', userRouter);

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

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 9010;

// Update the server startup
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});