// models/EHR.js
const mongoose = require('mongoose');

const EHRSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to the User model (patient)
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to the User model (doctor)
      required: true,
    },
    records: [
      {
        type: String,
        required: true,
      },
    ],
    prescriptions: [
      {
        medication: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
      },
    ],
    files: [
      {
        type: String, // This could store IPFS URLs or file paths
        required: true,
      },
    ],
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Who can access the medical record
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EHR', EHRSchema);