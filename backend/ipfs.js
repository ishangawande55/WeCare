const { create } = require("ipfs-http-client");
require("dotenv").config();

const projectId = process.env.INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

// Connect to Infura IPFS
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

async function uploadToIPFS(data) {
  const added = await ipfs.add(JSON.stringify(data));
  return `https://ipfs.io/ipfs/${added.path}`;
}

module.exports = uploadToIPFS;