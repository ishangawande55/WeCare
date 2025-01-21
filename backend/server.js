const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');

// Import the deployed contract (import from the correct path)
const deployContracts = require('../blockchain/scripts/deployContracts');
const blockchainLedger = deployContracts();
const appointmentContract = blockchainLedger.get('AppointmentContract');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // Parses JSON requests
app.use(cors());         // Allows cross-origin requests

// Connect to MongoDB
connectDB();

const server = http.createServer(app); // Wrap Express app in an HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow requests from frontend
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a room for patient-doctor communication
    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Listen for messages
    socket.on('sendMessage', (message) => {
        const { roomId, senderId, text } = message;
        io.to(roomId).emit('receiveMessage', { senderId, text, timestamp: new Date() });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// User Routes
app.use('/api/users', userRoutes);

// Appointment Routes
app.use('/api/appointments', appointmentRoutes);


// Blockchain API Routes
app.post('/appointments', (req, res) => {
    const { patientID, doctorID, reason } = req.body;
  
    if (!patientID || !doctorID || !reason) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const appointmentID = appointmentContract.bookAppointment(patientID, doctorID, reason);
      return res.status(200).json({ appointmentID });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
  
  app.get('/appointments/:appointmentID', (req, res) => {
    const { appointmentID } = req.params;
    const { userID } = req.query; // Could be patient or doctor ID
  
    try {
      const appointment = appointmentContract.viewAppointment(appointmentID, userID);
      return res.status(200).json(appointment);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
  
  app.post('/appointments/respond', (req, res) => {
    const { appointmentID, doctorID, response } = req.body;
  
    try {
      appointmentContract.respondToAppointment(appointmentID, doctorID, response);
      const updatedAppointment = appointmentContract.viewAppointment(appointmentID, doctorID);
      return res.status(200).json(updatedAppointment);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
  
  app.post('/appointments/schedule', (req, res) => {
    const { appointmentID, doctorID, scheduledTime } = req.body;
  
    try {
      appointmentContract.scheduleAppointment(appointmentID, doctorID, scheduledTime);
      const scheduledAppointment = appointmentContract.viewAppointment(appointmentID, doctorID);
      return res.status(200).json(scheduledAppointment);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});