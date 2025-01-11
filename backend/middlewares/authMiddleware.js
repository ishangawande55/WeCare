// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

const authenticateUser = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authenticateUser;