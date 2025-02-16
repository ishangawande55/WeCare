const express = require("express");
const Web3 = require("web3");
const { ethers } = require("ethers");
const contractABI = require("./contracts/PatientRecords.json").abi;
const uploadToIPFS = require("./ipfs");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(require("cors")());


const web3 = new Web3("https://sepolia.infura.io/v3/" + process.env.INFURA_PROJECT_ID);
const contractAddress = "0xYourNewContractAddress";
const contract = new web3.eth.Contract(contractABI, contractAddress);

app.post("/addRecord", async (req, res) => {
    const { patient, recordData, sender } = req.body;

    try {
        // Upload record to IPFS
        const ipfsHash = await uploadToIPFS(recordData);

        // Store hash on blockchain
        const tx = await contract.methods.addRecord(patient, ipfsHash).send({ from: sender });

        res.json({ success: true, txHash: tx.transactionHash, ipfsHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Meassaging function

async function encryptMessage(message, receiverAddress) {
    const publicKey = await web3.eth.getEncryptionPublicKey(receiverAddress);
    return ethers.utils.hexlify(Buffer.from(publicKey));
}

app.post("/sendMessage", async (req, res) => {
    const { sender, receiver, message } = req.body;

    try {
        const encryptedMessage = await encryptMessage(message, receiver);
        const ipfsHash = await uploadToIPFS({ sender, receiver, encryptedMessage });

        res.json({ success: true, ipfsHash });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

app.use(helmet()); // Adds security headers

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes
    message: "Too many requests, please try again later.",
});

app.use(limiter);

app.listen(8000, () => {
    console.log("Server running on port 8000");
});