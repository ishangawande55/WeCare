const express = require('express');
const { bookAppointment, acceptAppointment, rejectAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Book an appointment (patient)
router.post('/book', protect, bookAppointment);

// Accept an appointment (doctor)
router.put('/accept/:appointmentId', protect, acceptAppointment);

// Reject an appointment (doctor)
router.put('/reject/:appointmentId', protect, rejectAppointment);

module.exports = router;