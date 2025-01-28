// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ConsentManager {
    struct Consent {
        address doctor;       // Address of the doctor
        uint256 timestamp;    // Timestamp of when consent was granted
        bool active;          // Consent status (active/inactive)
    }

    // Mapping from patient address to their consents
    mapping(address => mapping(address => Consent)) public patientConsents;

    // Events for logging consent actions
    event ConsentGranted(address indexed patient, address indexed doctor, uint256 timestamp);
    event ConsentRevoked(address indexed patient, address indexed doctor, uint256 timestamp);

    /**
     * @dev Grant consent to a doctor.
     * @param doctor Address of the doctor to grant consent.
     */
    function grantConsent(address doctor) public {
        require(doctor != address(0), "Invalid doctor address");

        // Grant consent
        patientConsents[msg.sender][doctor] = Consent({
            doctor: doctor,
            timestamp: block.timestamp,
            active: true
        });

        emit ConsentGranted(msg.sender, doctor, block.timestamp);
    }

    /**
     * @dev Revoke consent from a doctor.
     * @param doctor Address of the doctor to revoke consent.
     */
    function revokeConsent(address doctor) public {
        require(patientConsents[msg.sender][doctor].active, "Consent not active");

        // Revoke consent
        patientConsents[msg.sender][doctor].active = false;

        emit ConsentRevoked(msg.sender, doctor, block.timestamp);
    }

    /**
     * @dev Check if a doctor has active consent from a patient.
     * @param patient Address of the patient.
     * @param doctor Address of the doctor.
     * @return Whether the consent is active or not.
     */
    function hasConsent(address patient, address doctor) public view returns (bool) {
        return patientConsents[patient][doctor].active;
    }
}