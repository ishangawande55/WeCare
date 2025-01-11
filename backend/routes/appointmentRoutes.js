// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointmentDetails,
  updateAppointmentStatus,
  getUserAppointments,
} = require('../controllers/appointmentController');
const { protect, isDoctor, isPatient } = require('../middlewares/authMiddleware');

// Create an appointment (only patients can create)
router.post('/', protect, isPatient, createAppointment);

// Get details of an appointment (can be accessed by patient and doctor)
router.get('/:id', protect, getAppointmentDetails);

// Update appointment status (can be accessed by doctor)
router.put('/:id/status', protect, isDoctor, updateAppointmentStatus);

// Get all appointments of a user (patient or doctor)
router.get('/user/:userId', protect, getUserAppointments);

module.exports = router;