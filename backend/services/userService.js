// services/userService.js
const User = require('../models/User');

// Update user profile
const updateUserProfile = async (userId, updateData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update user information
    Object.keys(updateData).forEach((key) => {
      user[key] = updateData[key];
    });

    await user.save();
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Delete a user account
const deleteUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await user.remove();
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  updateUserProfile,
  deleteUser,
};