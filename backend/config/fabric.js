// config/fabric.js
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Path to the network configuration
const ccpPath = path.resolve(__dirname, '..', 'fabric-network', 'connection-profile', 'connection-profile.json'); // Adjust path to your connection profile

// Set up the Fabric wallet
const wallet = new FileSystemWallet(path.join(__dirname, 'wallet'));

const connectFabric = async () => {
  try {
    // Check if the wallet exists
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('User does not exist in the wallet!');
      return;
    }

    // Set up the gateway to access the Fabric network
    const gateway = new Gateway();
    await gateway.connect(ccpPath, {
      wallet,
      identity: 'user1', // Identity to use for transactions (you can change this)
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network and the chaincode to interact with
    const network = await gateway.getNetwork('mychannel'); // Replace with your channel name
    const contract = network.getContract('ehrChaincode'); // Replace with your chaincode name

    // Now you can use the contract object to query or invoke transactions
    console.log('Fabric network connected and ready to interact with chaincode.');

    return contract; // Return the contract object to be used for further transactions

  } catch (error) {
    console.error(`Error connecting to Fabric network: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectFabric;