// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPayment, getPaymentDetails } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

// Create a payment after an appointment is confirmed
router.post('/', protect, createPayment);

// Get payment details (can be accessed by patients or admin)
router.get('/:id', protect, getPaymentDetails);

module.exports = router;