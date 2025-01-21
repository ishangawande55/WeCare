// Import necessary libraries
const crypto = require('crypto'); // For data hashing
const { v4: uuidv4 } = require('uuid'); // For generating unique record IDs

// Initialize the EHR Contract
class EHRContract {
  constructor() {
    // Initialize storage for health records
    this.records = new Map(); // Stores records as key-value pairs (recordID: data)
  }

  /**
   * Create a new health record
   * @param {string} patientID - The ID of the patient
   * @param {string} doctorID - The ID of the doctor creating the record
   * @param {object} recordData - The data to store in the record
   * @returns {string} recordID - The unique ID of the created record
   */
  createRecord(patientID, doctorID, recordData) {
    if (!patientID || !doctorID || !recordData) {
      throw new Error("Invalid input: patientID, doctorID, and recordData are required.");
    }

    const recordID = uuidv4(); // Generate a unique record ID
    const timestamp = new Date().toISOString(); // Record creation time

    const record = {
      patientID,
      doctorID,
      data: recordData,
      timestamp,
      accessLog: [] // Tracks who accesses this record
    };

    this.records.set(recordID, record); // Save the record in the storage
    return recordID;
  }

  /**
   * Retrieve a health record
   * @param {string} recordID - The ID of the record to retrieve
   * @param {string} requesterID - The ID of the entity requesting access
   * @returns {object} record - The retrieved record data
   */
  retrieveRecord(recordID, requesterID) {
    if (!this.records.has(recordID)) {
      throw new Error(`Record with ID ${recordID} does not exist.`);
    }

    const record = this.records.get(recordID);

    // Log the access request
    record.accessLog.push({
      requesterID,
      accessTime: new Date().toISOString()
    });

    return record;
  }

  /**
   * Update a health record
   * @param {string} recordID - The ID of the record to update
   * @param {string} updaterID - The ID of the entity updating the record
   * @param {object} newData - The updated data for the record
   */
  updateRecord(recordID, updaterID, newData) {
    if (!this.records.has(recordID)) {
      throw new Error(`Record with ID ${recordID} does not exist.`);
    }

    const record = this.records.get(recordID);

    // Only the doctor who created the record or the patient can update it
    if (record.doctorID !== updaterID && record.patientID !== updaterID) {
      throw new Error("Unauthorized access: Only the record owner or doctor can update it.");
    }

    record.data = newData; // Update the record data
    record.lastUpdated = new Date().toISOString(); // Track the update time
    this.records.set(recordID, record); // Save the updated record
  }

  /**
   * Delete a health record
   * @param {string} recordID - The ID of the record to delete
   * @param {string} deleterID - The ID of the entity deleting the record
   */
  deleteRecord(recordID, deleterID) {
    if (!this.records.has(recordID)) {
      throw new Error(`Record with ID ${recordID} does not exist.`);
    }

    const record = this.records.get(recordID);

    // Only the admin or patient can delete the record
    if (record.patientID !== deleterID) {
      throw new Error("Unauthorized access: Only the patient can delete their record.");
    }

    this.records.delete(recordID); // Remove the record
  }

  /**
   * Get the access log for a record
   * @param {string} recordID - The ID of the record
   * @returns {array} accessLog - The access log of the record
   */
  getAccessLog(recordID) {
    if (!this.records.has(recordID)) {
      throw new Error(`Record with ID ${recordID} does not exist.`);
    }

    const record = this.records.get(recordID);
    return record.accessLog;
  }
}

module.exports = EHRContract;
