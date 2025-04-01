import express from 'express';
import jwt from 'jsonwebtoken';
import {
  Admin,
  Course,
  User
} from '../db/index.js';

import {
  SECRET,
  authenticateJwt
} from "../middleware/auth.js";



const router = express.Router();

router.get("/me", authenticateJwt, async (req, res) => {
  const admin = await Admin.findOne({
    username: req.user.username
  });
  if (!admin) {
    res.status(403).json({
      msg: "Admin doesnt exist"
    })
    return
  }
  res.json({
    username: admin.username
  })
});

router.post('/signup', async (req, res) => {
  const {
    username,
    password
  } = req.body;

  try {
    const existingAdmin = await Admin.findOne({
      username
    });

    if (existingAdmin) {
      return res.status(403).json({
        message: 'Admin already exists'
      });
    }

    const newAdmin = new Admin({
      username,
      password
    });
    await newAdmin.save();

    const token = jwt.sign({
        username,
        role: 'admin',
        isAdmin: true
      }, // Include isAdmin
      SECRET, {
        expiresIn: '1h'
      }
    );

    res.json({
      message: 'Admin created successfully',
      token,
      isAdmin: true // Include isAdmin in response
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error creating admin',
      error: error.message
    });
  }
});


router.post('/login', async (req, res) => {
  const {
    username,
    password
  } = req.body;

  try {
    const admin = await Admin.findOne({
      username,
      password
    });

    if (!admin) {
      return res.status(403).json({
        message: 'Invalid username or password'
      });
    }

    const token = jwt.sign({
        username,
        role: 'admin',
        isAdmin: true
      }, // Include isAdmin in the token
      SECRET, {
        expiresIn: '1h'
      }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      isAdmin: true // Include isAdmin in the response
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
});

router.post('/courses', authenticateJwt, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json({
    message: 'Course created successfully',
    courseId: course.id
  });
});

router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true
  });
  if (course) {
    res.json({
      message: 'Course updated successfully'
    });
  } else {
    res.status(404).json({
      message: 'Course not found'
    });
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

router.get('/course/:courseId', authenticateJwt, async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  res.json({
    course
  });
});



router.delete('/course/:courseId', authenticateJwt, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }

    res.json({
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting course'
    });
  }
});

export default router;