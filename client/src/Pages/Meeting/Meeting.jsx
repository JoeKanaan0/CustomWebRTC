import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStream } from '../../Context/StreamContext';
import useSocket from "../../Hooks/useSocket";
import { handleMuteUnmute, handleOpenCloseCamera } from '../../Utils/Buttons'
import { addRemoteStream, removeRemoteStream } from '../../Utils/Stream';
import { createPeerConnection } from '../../WebRTC/PeerConnection';
import './Meeting.css';

function Meeting() {
  const userVideo = useRef();
  const navigate = useNavigate();

  const { localStream, remoteStreams, setRemoteStreams } = useStream(); // Access the streams from context

  const socket = useSocket(navigate);

  const [gridSize, setGridSize] = useState({ rows: 1, columns: 1 });

  useEffect(() => {
    if (localStream && userVideo.current) {
      userVideo.current.srcObject = localStream;
    }

    let peer;

    if (socket) {
      // Create the peer connection once for this client
      peer = createPeerConnection(localStream, (remoteStream, remotePeerId) => {
        addRemoteStream(remoteStream, remotePeerId, setRemoteStreams);
      }, socket);

      // Handle the event when a new user joins after this user
      socket.on('new-user-joined', (remotePeerId) => {
        // Use the existing peer instance to call the new user
        const call = peer.call(remotePeerId, localStream);

        call.on('stream', remoteStream => {
          // Handle the remote stream here
          addRemoteStream(remoteStream, remotePeerId, setRemoteStreams);
        });
      });

      // Handle the event when a user leaves the meeting
      socket.on('user-left', (leftPeerId) => {
        removeRemoteStream(leftPeerId, setRemoteStreams);
      });

      // Clean up on unmount
      return () => {
        if (peer) {
          peer.destroy();
        }
      };
    }
  }, [localStream, socket, setRemoteStreams]);


  useEffect(() => {
    const updateGridSize = () => {
      // Including the local user in the count
      const totalUsers = remoteStreams.length + 1;

      let columns = Math.min(4, totalUsers);
      let rows = Math.ceil(totalUsers / columns);

      setGridSize({ rows, columns });
    };

    updateGridSize();
  }, [remoteStreams]);


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

          {/* Dynamically create video elements for remote users */}
          {remoteStreams.map((remoteStream, index) => (
            <video key={remoteStream.id} ref={videoRef => {
              // Assign the remote stream to the video element
              if (videoRef) videoRef.srcObject = remoteStream.stream;
            }} id={`remoteVideo-${index}`} autoPlay></video>
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