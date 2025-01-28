// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CredentialVerifier {
    struct Doctor {
        string name;           // Name of the doctor
        string licenseCID;     // IPFS CID for license or credentials
        bool verified;         // Verification status
    }

    address public admin;       // Address of the admin
    mapping(address => Doctor) public doctors; // Mapping of doctor addresses to their data

    event DoctorRegistered(address indexed doctor, string name, string licenseCID);
    event DoctorVerified(address indexed doctor, bool verified);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender; // Set contract deployer as admin
    }

    /**
     * @dev Register a doctor.
     * @param name Name of the doctor.
     * @param licenseCID IPFS CID of the doctor's credentials.
     */
    function registerDoctor(string memory name, string memory licenseCID) public {
        require(bytes(doctors[msg.sender].name).length == 0, "Doctor already registered");

        doctors[msg.sender] = Doctor({
            name: name,
            licenseCID: licenseCID,
            verified: false
        });

        emit DoctorRegistered(msg.sender, name, licenseCID);
    }

    /**
     * @dev Verify a doctor's credentials.
     * @param doctor Address of the doctor to verify.
     * @param verified Verification status (true/false).
     */
    function verifyDoctor(address doctor, bool verified) public onlyAdmin {
        require(bytes(doctors[doctor].name).length > 0, "Doctor not registered");

        doctors[doctor].verified = verified;

        emit DoctorVerified(doctor, verified);
    }

    /**
     * @dev Check if a doctor is verified.
     * @param doctor Address of the doctor.
     * @return Whether the doctor is verified.
     */
    function isDoctorVerified(address doctor) public view returns (bool) {
        return doctors[doctor].verified;
    }
}