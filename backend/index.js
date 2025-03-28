import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectDB from './db/index.js';
import adminRouter from './routes/admin.js';
import userRouter from './routes/user.js';
import {
  User
} from './db/index.js'; // Import User model
import { SECRET } from './middleware/auth.js';

// Initialize database connection
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = process.env.PORT || 9010;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
