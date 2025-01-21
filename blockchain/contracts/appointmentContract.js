// Import necessary libraries
const { v4: uuidv4 } = require('uuid'); // For generating unique appointment IDs

// Initialize the Appointment Contract
class AppointmentContract {
  constructor() {
    // Initialize storage for appointments
    this.appointments = new Map(); // Stores appointments as key-value pairs (appointmentID: data)
  }

  /**
   * Book an appointment
   * @param {string} patientID - The ID of the patient booking the appointment
   * @param {string} doctorID - The ID of the doctor
   * @param {string} reason - The reason for the appointment
   * @returns {string} appointmentID - The unique ID of the booked appointment
   */
  bookAppointment(patientID, doctorID, reason) {
    if (!patientID || !doctorID || !reason) {
      throw new Error("Invalid input: patientID, doctorID, and reason are required.");
    }

    const appointmentID = uuidv4(); // Generate a unique appointment ID
    const timestamp = new Date().toISOString(); // Booking time

    const appointment = {
      appointmentID,
      patientID,
      doctorID,
      reason,
      status: "Pending", // Initial status
      timestamp,
      scheduledTime: null // Placeholder for scheduled time
    };

    this.appointments.set(appointmentID, appointment); // Save the appointment
    return appointmentID;
  }

  /**
   * Accept or reject an appointment
   * @param {string} appointmentID - The ID of the appointment to update
   * @param {string} doctorID - The ID of the doctor
   * @param {boolean} isAccepted - True if accepting, false if rejecting
   */
  respondToAppointment(appointmentID, doctorID, isAccepted) {
    if (!this.appointments.has(appointmentID)) {
      throw new Error(`Appointment with ID ${appointmentID} does not exist.`);
    }

    const appointment = this.appointments.get(appointmentID);

    if (appointment.doctorID !== doctorID) {
      throw new Error("Unauthorized access: Only the assigned doctor can respond to the appointment.");
    }

    appointment.status = isAccepted ? "Accepted" : "Rejected";
    appointment.responseTime = new Date().toISOString(); // Record response time

    this.appointments.set(appointmentID, appointment); // Update the appointment
  }

  /**
   * Schedule an accepted appointment
   * @param {string} appointmentID - The ID of the appointment to schedule
   * @param {string} doctorID - The ID of the doctor
   * @param {string} scheduledTime - The scheduled time for the appointment
   */
  scheduleAppointment(appointmentID, doctorID, scheduledTime) {
    if (!this.appointments.has(appointmentID)) {
      throw new Error(`Appointment with ID ${appointmentID} does not exist.`);
    }

    const appointment = this.appointments.get(appointmentID);

    if (appointment.doctorID !== doctorID) {
      throw new Error("Unauthorized access: Only the assigned doctor can schedule the appointment.");
    }

    if (appointment.status !== "Accepted") {
      throw new Error("Appointment must be accepted before scheduling.");
    }

    appointment.scheduledTime = scheduledTime; // Set the scheduled time
    appointment.status = "Scheduled"; // Update the status

    this.appointments.set(appointmentID, appointment); // Update the appointment
  }

  /**
   * View an appointment
   * @param {string} appointmentID - The ID of the appointment to view
   * @param {string} requesterID - The ID of the entity requesting access
   * @returns {object} appointment - The appointment details
   */
  viewAppointment(appointmentID, requesterID) {
    if (!this.appointments.has(appointmentID)) {
      throw new Error(`Appointment with ID ${appointmentID} does not exist.`);
    }

    const appointment = this.appointments.get(appointmentID);

    if (appointment.patientID !== requesterID && appointment.doctorID !== requesterID) {
      throw new Error("Unauthorized access: Only the patient or doctor can view the appointment.");
    }

    return appointment;
  }
}

module.exports = AppointmentContract;
