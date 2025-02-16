// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PatientRecords {
    struct Record {
        string ipfsHash;
        address addedBy;
        uint256 timestamp;
    }

    mapping(address => Record[]) private patientRecords;

    event RecordAdded(address indexed patient, string ipfsHash, address addedBy, uint256 timestamp);

    function addRecord(address _patient, string memory _ipfsHash) public {
        patientRecords[_patient].push(Record(_ipfsHash, msg.sender, block.timestamp));
        emit RecordAdded(_patient, _ipfsHash, msg.sender, block.timestamp);
    }

    function getRecords(address _patient) public view returns (Record[] memory) {
        return patientRecords[_patient];
    }
}