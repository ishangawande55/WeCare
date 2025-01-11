// controllers/chatController.js
// Assuming we are using a service like Socket.io for real-time chat
const Chat = require('../models/Chat'); // Assuming a Chat model exists

// Send a message
const sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const newMessage = new Chat({ senderId, receiverId, message });
    await newMessage.save();

    // Emit the message to the receiver using Socket.io or another real-time system
    // io.to(receiverId).emit('newMessage', newMessage);

    return res.status(201).json({ message: 'Message sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Fetch chat history
const getChatHistory = async (req, res) => {
  const { userId, otherUserId } = req.params;

  try {
    const chatHistory = await Chat.find({
      $or: [{ senderId: userId, receiverId: otherUserId }, { senderId: otherUserId, receiverId: userId }],
    }).sort({ createdAt: 1 });

    return res.json(chatHistory);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { sendMessage, getChatHistory };