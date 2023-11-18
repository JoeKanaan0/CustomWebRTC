import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Custom hook to manage a Socket.IO client connection.
 *
 * @param {function} navigate Function to navigate between routes.
 * @param {object} userVideo Ref object for the user's video element.
 * @param {function} setStream Function to set the user's media stream.
 * @returns {object} The Socket.IO client instance.
 */
const useSocket = (navigate, userVideo, setStream) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish a connection to the Socket.IO server
    const newSocket = io.connect('http://localhost:3001');
    setSocket(newSocket);

    // Event listener for 'host' event
    newSocket.on('host', () => {
      // Navigate to the meeting page and pass the state of audio and video tracks
      navigate('/meeting')
    });

    // Event listener for 'join' event
    newSocket.on('join', () => {
      navigate('/meeting');
    });

    // Event listener for 'no-host' event
    newSocket.on('no-host', () => {
      toast.error('No Hosted Meetings'); // Display an error toast if no meeting is hosted
    });

    // Event listener for 'host-left' event
    newSocket.on('host-left', () => {
      toast.info('Host has left the meeting'); // Display an info toast when host leaves
      navigate('/'); // Navigate back to the lobby
    });

    // Cleanup function
    return () => { newSocket.close() };

  }, [navigate, setStream, userVideo]);

  return socket;
};

export default useSocket;
