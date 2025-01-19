const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model for database validation

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token from Authorization header
            token = req.headers.authorization.split(' ')[1];

            // Decode token to get the user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user in the database and exclude sensitive data like password
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized, user not found' });
            }

            // Attach user data to request object
            req.user = user;

            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            console.error('Token verification failed:', err.message);
            res.status(401).json({ message: 'Unauthorized, invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized, no token provided' });
    }
};

module.exports = { protect };