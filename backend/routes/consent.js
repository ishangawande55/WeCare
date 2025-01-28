const express = require("express");
const router = express.Router();
const { consentManager, web3 } = require("../config/web3");

// Grant consent to a doctor
router.post("/grant", async (req, res) => {
  const { patient, doctor } = req.body;

  try {
    const receipt = await consentManager.methods
      .grantConsent(doctor)
      .send({ from: patient, gas: 300000 });

    res.json({ success: true, receipt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Revoke consent from a doctor
router.post("/revoke", async (req, res) => {
  const { patient, doctor } = req.body;

  try {
    const receipt = await consentManager.methods
      .revokeConsent(doctor)
      .send({ from: patient, gas: 300000 });

    res.json({ success: true, receipt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check consent status
router.get("/status", async (req, res) => {
  const { patient, doctor } = req.query;

  try {
    const hasConsent = await consentManager.methods
      .hasConsent(patient, doctor)
      .call();

    res.json({ success: true, hasConsent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;