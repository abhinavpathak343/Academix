import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectDB from '../db/index.js';
import {
  User,
  Course
} from '../db/index.js'; // Fixed path
import {
  authenticateJwt,
  SECRET
} from "../middleware/auth.js";

const app = express();
const router = express.Router();

// Initialize database connection
connectDB();

app.use(cors());
app.use(express.json());

// ✅ Define userRouter before using it
const userRouter = router;
app.use('/user', userRouter);

// ✅ Correct adminRouter import
import adminRouter from './admin.js';
app.use('/admin', adminRouter);

router.post('/signup', async (req, res) => {
  const {
    username,
    password
  } = req.body;
  const user = await User.findOne({
    username
  });

  if (user) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  const newUser = new User({
    username,
    password
  });
  await newUser.save();

  const token = jwt.sign({
    id: newUser._id,
    username: newUser.username
  }, SECRET, {
    expiresIn: '24h'
  });

  res.json({
    token,
    user: {
      username: newUser.username,
      id: newUser._id
    }
  });
});

router.post('/login', async (req, res) => {
  const {
    username,
    password
  } = req.headers;
  const user = await User.findOne({
    username,
    password
  });
  if (user) {
    const token = jwt.sign({
      username,
      role: 'user'
    }, SECRET, {
      expiresIn: '1h'
    });
    res.json({
      message: 'Logged in successfully',
      token
    });
  } else {
    res.status(403).json({
      message: 'Invalid username or password'
    });
  }
});

// Start the server


export default userRouter;
