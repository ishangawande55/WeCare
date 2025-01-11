// controllers/adminController.js
const User = require('../models/User'); // Assuming a User model exists

// View all users
const viewUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching users' });
  }
};

// View platform analytics (example)
const viewAnalytics = async (req, res) => {
  try {
    // Example analytics data (appointments, users, etc.)
    const totalUsers = await User.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    return res.json({ totalUsers, totalAppointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching analytics' });
  }
};

module.exports = { viewUsers, viewAnalytics };