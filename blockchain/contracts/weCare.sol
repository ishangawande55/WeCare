modifier onlyDoctor() {
    require(doctors[msg.sender].isVerified, "Only verified doctors can access this feature.");
    _;
}

function uploadRecord(address _patient, string memory _ipfsHash) public onlyDoctor {
    patientRecords[_patient].push(_ipfsHash);
}