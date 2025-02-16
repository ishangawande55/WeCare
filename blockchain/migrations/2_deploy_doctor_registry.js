const DoctorRegistry = artifacts.require("DoctorRegistry");

module.exports = function (deployer) {
  deployer.deploy(DoctorRegistry);
};