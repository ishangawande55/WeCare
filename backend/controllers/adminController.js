const User = require('../models/User');
const { uploadToIPFS } = require('../utils/ipfsHelper');
const { storeCID } = require('../blockchain/ethHelper');


// @desc Get all unapproved doctors
// @route GET /api/admin/doctors/unapproved
// @access Admin
const getUnapprovedDoctors = async (req, res) => {
    try {
        const unapprovedDoctors = await User.find({ role: 'doctor', isApproved: false });
        res.status(200).json(unapprovedDoctors);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Approve a doctor
// @route PUT /api/admin/doctors/:id/approve
// @access Admin
const approveDoctor = async (req, res) => {
    try {
        const doctor = await User.findById(req.params.id);

        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }


        doctor.isApproved = true;
        await doctor.save();

        res.status(200).json({ message: 'Doctor approved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Reject a doctor
// @route PUT /api/admin/doctors/:id/reject
// @access Admin
const rejectDoctor = async (req, res) => {
    const { rejectionReason } = req.body;

    try {
        const doctor = await User.findById(req.params.id);

        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        doctor.isApproved = false;
        doctor.rejectionReason = rejectionReason || 'Not specified';
        await doctor.save();

        res.status(200).json({ message: 'Doctor rejected successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Upload file and store CID on Ethereum
// @route POST /api/admin/doctors/upload
// @access Admin
const uploadFileAndStoreCID = async (req, res) => {
    const { doctorId } = req.body;

    try {
        // Check if the doctor exists
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Upload file to IPFS
        const { cid, hash } = await uploadToIPFS(req.file);

        // Store CID and hash on Ethereum
        const receipt = await storeCID(
            process.env.ADMIN_WALLET_ADDRESS,
            process.env.ADMIN_PRIVATE_KEY,
            cid,
            'doctor',
            hash
        );

        // Update doctor's record with CID
        doctor.licenseCID = cid;
        doctor.licenseHash = hash;
        await doctor.save();

        res.status(200).json({
            message: 'File uploaded and CID stored on Ethereum successfully',
            cid,
            hash,
            transactionHash: receipt.transactionHash,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload file or store CID', error: error.message });
    }
};

module.exports = { getUnapprovedDoctors, approveDoctor, rejectDoctor, uploadFileAndStoreCID };