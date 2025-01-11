// controllers/appointmentController.js
const Appointment = require('../models/Appointment'); // Assuming you have an Appointment model

// Book an appointment
const bookAppointment = async (req, res) => {
  const { doctorId, patientId, appointmentDate, message } = req.body;

  try {
    const newAppointment = new Appointment({ doctorId, patientId, appointmentDate, message, status: 'pending' });
    await newAppointment.save();

    return res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Accept an appointment (doctor)
const acceptAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'accepted';
    await appointment.save();

    return res.status(200).json({ message: 'Appointment accepted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Reject an appointment (doctor)
const rejectAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'rejected';
    await appointment.save();

    return res.status(200).json({ message: 'Appointment rejected' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { bookAppointment, acceptAppointment, rejectAppointment };