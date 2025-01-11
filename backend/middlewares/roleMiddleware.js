// middlewares/roleMiddleware.js
const authenticateUser = require('./authMiddleware');

// This middleware checks if the user has the required role
const authorizeRole = (roles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!roles.includes(role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    next(); // Proceed to the next middleware or route handler
  };
};

module.exports = authorizeRole;