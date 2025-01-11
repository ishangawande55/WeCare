// services/ehrService.js
const EHR = require('../models/EHR');

// Get patient EHR data
const getPatientEHR = async (patientId) => {
  try {
    const ehr = await EHR.findOne({ patient: patientId });
    if (!ehr) {
      throw new Error('EHR not found');
    }
    return ehr;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Add a new medical record for a patient
const addPatientRecord = async (patientId, recordData) => {
  try {
    const ehr = await EHR.findOne({ patient: patientId });
    if (!ehr) {
      throw new Error('EHR not found');
    }

    ehr.records.push(recordData);
    await ehr.save();
    return ehr;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Share medical records with another doctor
const sharePatientRecord = async (patientId, doctorId) => {
  try {
    const ehr = await EHR.findOne({ patient: patientId });
    if (!ehr) {
      throw new Error('EHR not found');
    }

    // Share with the other doctor (could involve adding access permissions or notifications)
    // Implement the logic here to share with doctor
    return ehr;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getPatientEHR,
  addPatientRecord,
  sharePatientRecord,
};