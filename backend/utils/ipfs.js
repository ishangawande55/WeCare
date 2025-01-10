const { create } = require('ipfs-http-client');

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const uploadFile = async (file) => {
    const result = await ipfs.add(file);
    return result.path; // Returns the IPFS hash
};

const getFile = async (hash) => {
    const file = await ipfs.cat(hash);
    return file;
};

module.exports = { uploadFile, getFile };