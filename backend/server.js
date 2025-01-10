const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const { uploadFile, getFile } = require('./utils/ipfs'); // Import IPFS utils
const multer = require('multer'); // For handling file uploads
require('dotenv').config();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());

// File upload configuration (using multer)
const upload = multer();

// Connect to Database
connectDB();

// Define Routes
app.use('/api/users', userRoutes);

// Create HTTP Server and Attach Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// WebSocket Handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Example: Handle IPFS file upload via WebSocket
    socket.on('uploadFile', async (fileBuffer) => {
        try {
            const fileHash = await uploadFile(fileBuffer);
            socket.emit('fileUploaded', { hash: fileHash });
        } catch (err) {
            console.error(err);
            socket.emit('error', 'File upload failed');
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// API Routes for IPFS Integration

// Route to upload a file to IPFS
app.post('/api/ipfs/upload', upload.single('file'), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer; // Access file buffer
        const fileHash = await uploadFile(fileBuffer); // Upload to IPFS
        res.json({ hash: fileHash }); // Return IPFS hash
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to upload file to IPFS' });
    }
});

// Route to fetch a file from IPFS
app.get('/api/ipfs/:hash', async (req, res) => {
    try {
        const fileHash = req.params.hash;
        const file = await getFile(fileHash); // Retrieve file from IPFS
        res.send(file); // Send the file data
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve file from IPFS' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});