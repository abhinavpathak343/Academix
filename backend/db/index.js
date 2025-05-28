import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGODB_URI;
// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};




// Schemas
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageLink: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  published: {
    type: Boolean,
    default: true
  },
  admin: {
    type: String, // Changed from ObjectId to String to store username
    required: true
  }
}, {
  timestamps: true
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

// Models
export const Course = mongoose.model('Course', courseSchema);
export const Admin = mongoose.model('Admin', adminSchema);
export const User = mongoose.model('User', userSchema);

export default connectDB;