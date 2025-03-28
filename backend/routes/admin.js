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

router.post('/signup', (req, res) => {
  const {
    username,
    password
  } = req.body;

  function callback(admin) {
    if (admin) {
      res.status(403).json({
        message: 'Admin already exists'
      });
    } else {
      const obj = {
        username: username,
        password: password
      };
      const newAdmin = new Admin(obj);
      newAdmin.save();

      const token = jwt.sign({
        username,
        role: 'admin'
      }, SECRET, {
        expiresIn: '1h'
      });
      res.json({
        message: 'Admin created successfully',
        token
      });
    }

  }
  Admin.findOne({
    username
  }).then(callback);
});

router.post('/login', async (req, res) => {
  const {
    username,
    password
  } = req.body;
  const admin = await Admin.findOne({
    username,
    password
  });

  if (admin) {
    const token = jwt.sign({
      username,
      role: 'admin'
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

router.get('/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({});
  res.json({
    courses
  });
});

router.get('/course/:courseId', authenticateJwt, async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  res.json({
    course
  });
});

router.post('/signin', async (req, res) => {
  try {
    const {
      username,
      password
    } = req.body;

    const admin = await Admin.findOne({
      username
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (admin.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign({
      id: admin._id,
      username: admin.username,
      role: 'admin'
    }, SECRET, {
      expiresIn: '24h'
    });

    res.json({
      token,
      admin: {
        username: admin.username,
        id: admin._id
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
});

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

export default router;