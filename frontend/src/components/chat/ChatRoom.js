import React, { useState, useEffect } from 'react';
import socket from '../../utils/socket';

const ChatRoom = ({ roomId, userId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        socket.emit('joinRoom', { roomId });

        socket.on('receiveMessage', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId]);

    const handleSendMessage = () => {
        const message = { roomId, senderId: userId, text: newMessage };
        socket.emit('sendMessage', message);
        setMessages((prev) => [...prev, { ...message, timestamp: new Date() }]);
        setNewMessage('');
    };

    return (
        <div className="chat-room">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.senderId === userId ? 'sent' : 'received'}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;