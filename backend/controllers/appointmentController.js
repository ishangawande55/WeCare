const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { generateVideoCallLink } = require('../utils/videoCall'); // Function to generate a video call link

// Book an appointment
const bookAppointment = async (req, res) => {
    const { doctorId, date, timeSlot } = req.body;
    const patientId = req.user.id;

    try {
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(400).json({ message: 'Doctor not found' });
        }

        const appointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date,
            timeSlot,
        });

        await appointment.save();
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Accept an appointment
const acceptAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const doctorId = req.user.id;

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment || appointment.doctor.toString() !== doctorId) {
            return res.status(400).json({ message: 'Appointment not found or not assigned to you' });
        }

        appointment.status = 'accepted';
        appointment.videoCallLink = generateVideoCallLink(); // Generate a video call link for the appointment
        await appointment.save();

        res.status(200).json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Reject an appointment
const rejectAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const doctorId = req.user.id;

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment || appointment.doctor.toString() !== doctorId) {
            return res.status(400).json({ message: 'Appointment not found or not assigned to you' });
        }

        appointment.status = 'rejected';
        await appointment.save();

        res.status(200).json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = { bookAppointment, acceptAppointment, rejectAppointment };