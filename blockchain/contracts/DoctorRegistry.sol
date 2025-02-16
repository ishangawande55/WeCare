// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DoctorRegistry {
    struct Doctor {
        string name;
        string specialization;
        string licenseNumber;
        address walletAddress;
        bool verified;
    }

    mapping(address => Doctor) public doctors;
    address[] public doctorList;
    address public admin;

    event DoctorRegistered(address indexed doctorAddress, string name, string specialization);
    event DoctorVerified(address indexed doctorAddress, bool status);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can verify doctors");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerDoctor(
        string memory _name,
        string memory _specialization,
        string memory _licenseNumber
    ) public {
        require(doctors[msg.sender].walletAddress == address(0), "Doctor already registered");
        
        doctors[msg.sender] = Doctor({
            name: _name,
            specialization: _specialization,
            licenseNumber: _licenseNumber,
            walletAddress: msg.sender,
            verified: false
        });

        doctorList.push(msg.sender);
        emit DoctorRegistered(msg.sender, _name, _specialization);
    }

    function verifyDoctor(address _doctorAddress) public onlyAdmin {
        require(doctors[_doctorAddress].walletAddress != address(0), "Doctor not found");
        
        doctors[_doctorAddress].verified = true;
        emit DoctorVerified(_doctorAddress, true);
    }

    function getDoctor(address _doctorAddress) public view returns (string memory, string memory, string memory, bool) {
        require(doctors[_doctorAddress].walletAddress != address(0), "Doctor not found");

        Doctor memory doc = doctors[_doctorAddress];
        return (doc.name, doc.specialization, doc.licenseNumber, doc.verified);
    }

    function getAllDoctors() public view returns (address[] memory) {
        return doctorList;
    }
}