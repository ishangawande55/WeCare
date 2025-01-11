// utils/generateJWT.js
const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateJWT;