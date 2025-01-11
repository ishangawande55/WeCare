// routes/ehrRoutes.js
const express = require('express');
const router = express.Router();
const { getPatientEHR, addPatientRecord, sharePatientRecord } = require('../controllers/ehrController');
const { protect, isDoctor, isPatient } = require('../middlewares/authMiddleware');

// Get the patient's EHR records
router.get('/:patientId', protect, isPatient, getPatientEHR);

// Add new medical record (only doctors can add records)
router.post('/:patientId/record', protect, isDoctor, addPatientRecord);

// Share medical record with another doctor (can be done by the doctor or patient)
router.put('/:patientId/share', protect, sharePatientRecord);

module.exports = router;