// Import the Deployment Script
const deployContracts = require('../scripts/deployContracts');

// Deploy Contracts and Retrieve the Ledger
const blockchainLedger = deployContracts();
const appointmentContract = blockchainLedger.get("AppointmentContract");

console.log("\n=== TEST: Appointment Booking ===");
const appointmentID = appointmentContract.bookAppointment("patient123", "doctor456", "General Consultation");
console.log("Appointment Booked:", appointmentID);

console.log("\n=== TEST: View Appointment ===");
const appointment = appointmentContract.viewAppointment(appointmentID, "patient123");
console.log("Appointment Details:", appointment);

console.log("\n=== TEST: Doctor Responds to Appointment ===");
appointmentContract.respondToAppointment(appointmentID, "doctor456", true);
const updatedAppointment = appointmentContract.viewAppointment(appointmentID, "doctor456");
console.log("Updated Appointment Details (Accepted):", updatedAppointment);

console.log("\n=== TEST: Schedule Appointment ===");
appointmentContract.scheduleAppointment(appointmentID, "doctor456", "2025-01-22T10:00:00Z");
const scheduledAppointment = appointmentContract.viewAppointment(appointmentID, "patient123");
console.log("Scheduled Appointment Details:", scheduledAppointment);

console.log("\n=== TEST: Unauthorized Access ===");
try {
  appointmentContract.viewAppointment(appointmentID, "randomUser789");
} catch (err) {
  console.error("Access Denied:", err.message);
}