const IPFS = require("ipfs-http-client");
require("dotenv").config();

const ipfs = IPFS.create({
  host: "ipfs.infura.io",  // Replace with your IPFS host
  port: 5001,             // IPFS port
  protocol: "https",      // HTTP or HTTPS
});

module.exports = ipfs;