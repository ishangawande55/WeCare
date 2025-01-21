import React from 'react';
import Jitsi from 'react-jitsi'; // Use the default export

const VideoCall = ({ roomName, displayName }) => {
    return (
        <div style={{ height: '100vh' }}>
            <Jitsi
                roomName={roomName}
                displayName={displayName}
                password=""
                onMeetingEnd={() => console.log('Meeting has ended')}
                loadingComponent={<p>Loading...</p>}
            />
        </div>
    );
};

export default VideoCall;