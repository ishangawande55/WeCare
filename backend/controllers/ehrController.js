// controllers/ehrController.js
const connectFabric = require('../config/fabric'); // Assuming you have fabric.js for network interaction

// Add a new EHR record
const addEHR = async (req, res) => {
  const { patientId, doctorId, recordData } = req.body;

  try {
    const contract = await connectFabric();
    await contract.submitTransaction('createEHR', patientId, doctorId, recordData);
    return res.status(201).json({ message: 'EHR record added successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error adding EHR record' });
  }
};

// Get EHR by patient ID
const getEHR = async (req, res) => {
  const { patientId } = req.params;

  try {
    const contract = await connectFabric();
    const result = await contract.evaluateTransaction('getEHR', patientId);
    return res.json(JSON.parse(result.toString()));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching EHR record' });
  }
};

module.exports = { addEHR, getEHR };