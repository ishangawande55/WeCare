const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// User registration route
router.post('/register', registerUser);

// User login route
router.post('/login', loginUser);

// User profile route (protected)
router.get('/profile', protect, (req, res) => {
    res.status(200).json({ 
        message: 'Welcome to your profile', 
        user: req.user // `protect` middleware sets `req.user`
    });
});

module.exports = router;