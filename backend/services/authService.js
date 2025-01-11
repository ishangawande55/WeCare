// services/authService.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (userData) => {
  const { username, email, password, role } = userData;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Login user
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { user, token };
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get user profile by ID
const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};