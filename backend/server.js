const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const appointmentRoutes = require('./routes/appointment');
const ehrRoutes = require('./routes/ehr');
const paymentRoutes = require('./routes/payment'); // New route for payments
const authMiddleware = require('./middleware/auth'); // Authorization middleware
const { uploadFile, getFile } = require('./utils/ipfs'); // IPFS utils for file upload
const multer = require('multer'); // For file uploads
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // To parse incoming JSON requests
app.use(authMiddleware); // Protect routes with authentication middleware

// File upload configuration (using multer)
const upload = multer();

// Connect to the Database (MongoDB and Hyperledger Fabric)
connectDB();

// API Routes
app.use('/api/users', userRoutes); // User-related routes (register, login, etc.)
app.use('/api/appointments', appointmentRoutes); // Appointment-related routes
app.use('/api/ehr', ehrRoutes); // Electronic Health Record (EHR) routes
app.use('/api/payments', paymentRoutes); // Payment routes (for consultation payments)

// IPFS Integration Routes
app.post('/api/ipfs/upload', upload.single('file'), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        const fileHash = await uploadFile(fileBuffer); // Upload file to IPFS
        res.json({ hash: fileHash }); // Return IPFS hash
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload file to IPFS' });
    }
});

app.get('/api/ipfs/:hash', async (req, res) => {
    try {
        const fileHash = req.params.hash;
        const file = await getFile(fileHash); // Fetch file from IPFS
        res.send(file); // Send the file data to the client
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve file from IPFS' });
    }
});

// Create HTTP Server and Attach Socket.IO for Real-Time Communication
const server = http.createServer(app);
const io = new Server(server);

// WebSocket Handling (for real-time chat and consultation features)
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a specific room (e.g., for a specific appointment)
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    // Handle message sending in a room
    socket.on('send-message', ({ roomId, message }) => {
        io.to(roomId).emit('receive-message', message); // Send message to all users in the room
    });

    // Handle file upload via WebSocket and save to IPFS
    socket.on('uploadFile', async (fileBuffer) => {
        try {
            const fileHash = await uploadFile(fileBuffer); // Upload file to IPFS
            socket.emit('fileUploaded', { hash: fileHash }); // Emit success with file hash
        } catch (err) {
            console.error(err);
            socket.emit('error', 'File upload failed'); // Emit failure message
        }
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});