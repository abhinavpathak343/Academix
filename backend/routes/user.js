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

// User Signup Route
router.post('/signup', async (req, res) => {
  const {
    username,
    password
  } = req.body;

  try {
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
        username: newUser.username,
        isAdmin: false
      }, // Include isAdmin: false
      SECRET, {
        expiresIn: '24h'
      }
    );

    res.json({
      token,
      user: {
        username: newUser.username,
        id: newUser._id,
        isAdmin: false // Include isAdmin in the response
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error signing up',
      error: error.message
    });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username
    });
    if (user && user.password === req.body.password) {
      const token = jwt.sign({
        username: user.username, // Make sure this is included
        email: user.email, // Include email if available
        role: 'user',
        isAdmin: false
      }, SECRET, {
        expiresIn: '7d'
      });

      res.json({
        message: 'Logged in successfully',
        token
      });
    }
  } catch (error) {
    // ...error handling
  }
});

router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({
      published: true
    });
    res.json({
      courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      message: 'Error fetching courses'
    });
  }
});

router.get('/course/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }
    res.json({
      course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      message: 'Error fetching course details'
    });
  }
});

// Start the server


export default userRouter;