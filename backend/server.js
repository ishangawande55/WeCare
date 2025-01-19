const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');



// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // Parses JSON requests
app.use(cors());         // Allows cross-origin requests

// Connect to MongoDB
connectDB();

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});