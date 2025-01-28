const express = require("express");
const router = express.Router();
const { credentialVerifier, web3 } = require("../config/web3");
const ipfs = require("../config/ipfs");

// Register a doctor
router.post("/register", async (req, res) => {
  const { doctor, name, credentials } = req.body;

  try {
    // Upload credentials to IPFS
    const result = await ipfs.add(credentials);

    const receipt = await credentialVerifier.methods
      .registerDoctor(name, result.path)
      .send({ from: doctor, gas: 300000 });

    res.json({ success: true, receipt, cid: result.path });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify a doctor
router.post("/verify", async (req, res) => {
  const { admin, doctor, verified } = req.body;

  try {
    const receipt = await credentialVerifier.methods
      .verifyDoctor(doctor, verified)
      .send({ from: admin, gas: 300000 });

    res.json({ success: true, receipt });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check doctor verification status
router.get("/status", async (req, res) => {
  const { doctor } = req.query;

  try {
    const isVerified = await credentialVerifier.methods
      .isDoctorVerified(doctor)
      .call();

    res.json({ success: true, isVerified });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;