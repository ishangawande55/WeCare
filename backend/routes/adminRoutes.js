const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFileAndStoreCID } = require('../controllers/adminController');

const {
    getUnapprovedDoctors,
    approveDoctor,
    rejectDoctor,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Admin routes (requires admin authorization)
router.use(protect, authorize('admin'));

// Get all unapproved doctors
router.get('/doctors/unapproved', getUnapprovedDoctors);

// Approve a doctor
router.put('/doctors/:id/approve', approveDoctor);

// Reject a doctor
router.put('/doctors/:id/reject', rejectDoctor);

// Upload file and store CID
router.post('/doctors/upload', protect, authorize('admin'), upload.single('file'), uploadFileAndStoreCID);

module.exports = router;