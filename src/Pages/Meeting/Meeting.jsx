import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStream } from '../../Context/StreamContext'; 
import useSocket from "../../Hooks/useSocket"; 
import { handleMuteUnmute, handleOpenCloseCamera } from '../../Utils/Buttons'
import './Meeting.css';

function Meeting() {
  const userVideo = useRef();
  const navigate = useNavigate();

  const { stream, setStream } = useStream(); // Access the stream from context

  const socket = useSocket(navigate, userVideo, setStream);

  useEffect(() => {
    if (stream && userVideo.current) {
      userVideo.current.srcObject = stream;
    }
  }, [stream]);

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
      <main>
        {/* Video elements for displaying local and remote videos */}
        <video ref={userVideo} id="localVideo" autoPlay muted></video>
        <video id="remoteVideo" autoPlay></video>
        <div>
          {/* Buttons to control mute/unmute and camera, and to leave the call */}
          <button onClick={() => handleMuteUnmute(stream)}>Mute/Unmute</button>
          <button onClick={() => handleOpenCloseCamera(userVideo)}>Open/Close Camera</button>
          <button id="callButton" onClick={handleLeave}>Leave</button>
        </div>
      </main>
    </div>
  );
}

export default Meeting;
