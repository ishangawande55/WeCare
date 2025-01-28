const Web3 = require("web3");
const ConsentManagerJSON = require("../../build/contracts/ConsentManager.json");
const CredentialVerifierJSON = require("../../build/contracts/CredentialVerifier.json");

// Load environment variables
require("dotenv").config();

const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545"); // Ganache RPC URL
const web3 = new Web3(provider);

// Load deployed contracts
const consentManager = new web3.eth.Contract(
  ConsentManagerJSON.abi,
  ConsentManagerJSON.networks["1337"].address // Replace 5777 with your network ID
);

const credentialVerifier = new web3.eth.Contract(
  CredentialVerifierJSON.abi,
  CredentialVerifierJSON.networks["1337"].address // Replace 5777 with your network ID
);

module.exports = { web3, consentManager, credentialVerifier };