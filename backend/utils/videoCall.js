const generateVideoCallLink = () => {
    // In a real-world app, this would generate a unique link via a service like Zoom
    return 'https://example.com/video-call/' + new Date().getTime(); // Simple unique link for now
};

module.exports = { generateVideoCallLink };