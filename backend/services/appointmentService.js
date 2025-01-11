// services/appointmentService.js
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Create an appointment
const createAppointment = async (patientId, doctorId, dateTime, status) => {
  try {
    // Create a new appointment
    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      dateTime,
      status: status || 'pending',
    });

    await appointment.save();
    return appointment;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get appointment details
const getAppointmentDetails = async (appointmentId) => {
  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'username email')
      .populate('doctor', 'username email');
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    return appointment;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Update appointment status
const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    appointment.status = status;
    await appointment.save();
    return appointment;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get all appointments of a user (patient or doctor)
const getUserAppointments = async (userId) => {
  try {
    const appointments = await Appointment.find({
      $or: [{ patient: userId }, { doctor: userId }],
    })
      .populate('patient', 'username email')
      .populate('doctor', 'username email');
    return appointments;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  createAppointment,
  getAppointmentDetails,
  updateAppointmentStatus,
  getUserAppointments,
};