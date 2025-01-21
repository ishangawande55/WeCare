const EHRContract = require('./ehrContract');

const ehr = new EHRContract();

const recordID = ehr.createRecord("patient123", "doctor456", { diagnosis: "Flu", prescription: "Rest" });
console.log("Record Created:", recordID);

const record = ehr.retrieveRecord(recordID, "admin789");
console.log("Record Retrieved:", record);

ehr.updateRecord(recordID, "doctor456", { diagnosis: "Cold", prescription: "Medicine" });
console.log("Record Updated:", ehr.retrieveRecord(recordID, "admin789"));

console.log("Access Log:", ehr.getAccessLog(recordID));
