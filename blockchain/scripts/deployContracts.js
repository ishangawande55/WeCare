// Import the Appointment Contract
const AppointmentContract = require('../contracts/appointmentContract');

// Simulating a blockchain ledger
const blockchainLedger = new Map();

/**
 * Deploy Contracts
 */
function deployContracts() {
  console.log("=== Deployment Start ===");

  const AppointmentContract = require('../contracts/appointmentContract');
  const blockchainLedger = new Map();

  // Create an instance of the AppointmentContract
  const appointmentContract = new AppointmentContract();
  blockchainLedger.set("AppointmentContract", appointmentContract);

  console.log("=== Appointment Contract Deployed ===");
  return blockchainLedger;
}

module.exports = deployContracts;

/**
 * Deployment Execution
 */
try {
  const ledger = deployContracts();

  console.log("\n=== Deployed Contracts ===");
  ledger.forEach((contract, address) => {
    console.log(`Address: ${address}, Contract: ${contract.constructor.name}`);
  });
} catch (err) {
  console.error("Deployment Failed:", err.message);
}
