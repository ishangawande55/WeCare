// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { updateUserProfile, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Update user profile (patient, doctor, or admin)
router.put('/profile', protect, updateUserProfile);

// Delete user account (can be accessed by admin or the user themselves)
router.delete('/:id', protect, deleteUser);

module.exports = router;