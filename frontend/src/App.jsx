import React, { useEffect, useState } from "react";
import Web3 from "web3";
import DoctorRegistryContract from "./contracts/DoctorRegistry.json";


const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [admin, setAdmin] = useState("");

  const sendMessage = async () => {
    const message = "Hello, how are you feeling today?"; // Example message
    const receiver = "0xReceiverEthereumAddress"; // Change this dynamically

    const response = await fetch("http://localhost:5000/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: account, receiver, message }),
    });

    const data = await response.json();
    if (data.success) {
      alert(`Message stored on IPFS: ${data.ipfsHash}`);
    } else {
      alert("Failed to send message.");
    }
  };

  const addPatientRecord = async () => {
    const recordData = {
      diagnosis: "Flu",
      prescription: "Paracetamol 500mg",
      notes: "Rest and hydration recommended",
      timestamp: new Date().toISOString(),
    };

    const response = await fetch("http://localhost:8000/addRecord", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient: account,
        recordData,
        sender: account,
      }),
    });

    const data = await response.json();
    if (data.success) {
      alert(`Record stored on IPFS: ${data.ipfsHash}`);
    } else {
      alert("Failed to store record.");
    }
  };

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = DoctorRegistryContract.networks[networkId];

        if (deployedNetwork) {
          const contractInstance = new web3.eth.Contract(
            DoctorRegistryContract.abi,
            deployedNetwork.address
          );
          setContract(contractInstance);

          // Get contract admin (deployer)
          const contractAdmin = await contractInstance.methods.admin().call();
          setAdmin(contractAdmin);
        } else {
          alert("Smart contract not deployed to detected network.");
        }
      } else {
        alert("Please install MetaMask.");
      }
    };

    loadBlockchainData();
  }, []);

  const registerDoctor = async () => {
    if (contract) {
      await contract.methods
        .registerDoctor(doctorName, specialization, licenseNumber)
        .send({ from: account });

      alert("Doctor registered successfully!");
      fetchDoctors();
    }
  };

  const fetchDoctors = async () => {
    if (contract) {
      const doctorAddresses = await contract.methods.getAllDoctors().call();
      const doctorData = await Promise.all(
        doctorAddresses.map(async (address) => {
          return {
            address,
            ...(await contract.methods.getDoctor(address).call()),
          };
        })
      );
      setDoctors(doctorData);
    }
  };

  const verifyDoctor = async (doctorAddress) => {
    if (contract) {
      await contract.methods
        .verifyDoctor(doctorAddress)
        .send({ from: account });
      alert("Doctor verified successfully!");
      fetchDoctors();
    }
  };

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        setAccount(accounts[0]);
      } else {
        alert("Please install MetaMask to use this application.");
      }
    }
    loadWeb3();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          weCare - Decentralized Telemedicine
        </h2>
        <p>Connected Account: {account ? account : "Not connected"}</p>
      <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition" onClick={() => window.ethereum.request({ method: "eth_requestAccounts" })}>
        Connect MetaMask
      </button>
        <p className="text-gray-500 text-center">
          Admin Address: <span className="font-semibold">{admin}</span>
        </p>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Register a Doctor
          </h3>
          <input
            type="text"
            placeholder="Doctor Name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
          <input
            type="text"
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
          <input
            type="text"
            placeholder="License Number"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
          <button
            onClick={registerDoctor}
            className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700">Doctors List</h3>
          <button
            onClick={fetchDoctors}
            className="w-full bg-green-600 text-white py-2 mt-2 rounded hover:bg-green-700 transition"
          >
            Fetch Doctors
          </button>
          <ul className="mt-4">
            {doctors.map((doc, index) => (
              <li
                key={index}
                className="bg-gray-200 p-3 rounded mt-2 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{doc[0]}</p>
                  <p className="text-sm text-gray-600">
                    {doc[1]} - {doc[2]}
                  </p>
                  <p className="text-sm">
                    {doc[3] ? "✅ Verified" : "❌ Not Verified"}
                  </p>
                </div>
                {account === admin && !doc[3] && (
                  <button
                    onClick={() => verifyDoctor(doc.address)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Verify
                  </button>
                )}
                <button
                  onClick={addPatientRecord}
                  className="bg-green-600 text-white py-2 mt-4 rounded hover:bg-green-700 transition"
                >
                  Add Patient Record
                </button>
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700 transition"
                >
                  Send Secure Message
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
