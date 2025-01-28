const ConsentManager = artifacts.require("ConsentManager");
const CredentialVerifier = artifacts.require("CredentialVerifier");

module.exports = function (deployer) {
  deployer.deploy(ConsentManager);
  deployer.deploy(CredentialVerifier);
};