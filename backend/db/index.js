import mongoose from 'mongoose';

// Database connection



// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://10abhinavpathak:abhi@cluster0.7xtoz.mongodb.net/courses', {
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
  title: String,
  
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
     admin: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Admin' // Reference to the Admin model
     }
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