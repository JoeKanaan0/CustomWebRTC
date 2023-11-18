import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStream } from '../../Context/StreamContext';
import useSocket from "../../Hooks/useSocket";
import { handleMuteUnmute, handleOpenCloseCamera } from '../../Utils/Buttons'
import './Meeting.css';

function Meeting() {
  const userVideo = useRef();
  const navigate = useNavigate();

  const { localStream, remoteStreams, setRemoteStreams } = useStream(); // Access the streams from context

  const socket = useSocket(navigate);

  const [otherUsersCount, setOtherUsersCount] = useState(0);
  const [gridSize, setGridSize] = useState({ rows: 1, columns: 1 });


  useEffect(() => {
    if (localStream && userVideo.current) {
      userVideo.current.srcObject = localStream;
    }

    if (socket) {
      // Fetch the user count and update the state
      socket.on('user-count-updated', (count) => {
        setOtherUsersCount(count - 1); // Subtract 1 for the current user
      });

      // When a new user joins, fetch his video and add it to the remote streams
      socket.on('user-joined', (newUserId) => {
        // Add to remote stream array

      })

    }

  }, [localStream, socket]);

  useEffect(() => {
    const updateGridSize = () => {
      const totalUsers = otherUsersCount + 1;

      let columns = Math.min(4, totalUsers);
      let rows = Math.ceil(totalUsers / columns);
      
      setGridSize({ rows, columns });
    };
  
    updateGridSize();
  }, [otherUsersCount]);
  
  

  // Grid style based on computed rows and columns
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize.columns}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
    gap: '10px',
    padding: '5px'
  };

  /**
   * Function to handle leaving the meeting.
   * Navigates the user back to the root route.
   */
  const handleLeave = () => {
    if (socket) {
      socket.emit('left'); // Emit 'leave' event when leaving the meeting
    }
    navigate('/');
  };

  return (
    <div className="App">
      <div className="main-content">
        <div className="video-grid" style={gridStyle}>
          {/* Local video */}
          <video ref={userVideo} id="localVideo" autoPlay muted></video>

          {/* Dynamically create video elements for other users */}
          {[...Array(otherUsersCount)].map((_, index) => (
            <video key={index} id={`remoteVideo-${index}`} autoPlay></video>
          ))}
        </div>
      </div>
      <div className="control-buttons">
        {/* Buttons to control mute/unmute and camera, and to leave the call */}
        <button onClick={() => handleMuteUnmute(localStream)}>Mute/Unmute</button>
        <button onClick={() => handleOpenCloseCamera(userVideo)}>Open/Close Camera</button>
        <button id="callButton" onClick={handleLeave}>Leave</button>
      </div>
    </div>


  )
}

export default Meeting;
