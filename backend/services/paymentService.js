// services/paymentService.js
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Create a payment for an appointment
const createPayment = async (paymentData) => {
  const { patientId, doctorId, appointmentId, amount, paymentMethod, transactionId } = paymentData;

  try {
    // Ensure the appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Create the payment record
    const payment = new Payment({
      patient: patientId,
      doctor: doctorId,
      appointment: appointmentId,
      amount,
      paymentMethod,
      transactionId,
      status: 'completed', // Assuming the payment is successful
    });

    await payment.save();

    // Update the appointment status to completed
    appointment.status = 'completed';
    await appointment.save();

    return payment;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Get payment details
const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId)
      .populate('patient', 'username email')
      .populate('doctor', 'username email')
      .populate('appointment', 'dateTime status');
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  createPayment,
  getPaymentDetails,
};