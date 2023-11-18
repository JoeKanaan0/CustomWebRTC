import React, { useRef, useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import { handleMuteUnmute, handleOpenCloseCamera } from '../../Utils/Buttons';
import MeetingService from '../../Services/MeetingService';
import './Lobby.css';
import { useStream } from '../../Context/StreamContext';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for toasts

/**
 * The Lobby component is responsible for managing the lobby area of the application.
 * It handles hosting and joining meetings, as well as user video and audio controls.
 */
function Lobby() {
    // State hooks to manage hosting, joining, and stream state
    const { setLocalStream } = useStream();

    // Ref for the user's video element
    const userVideo = useRef();

    // Hook to navigate between routes
    const navigate = useNavigate();

    // useEffect hook to request media access
    useEffect(() => {
        // Request access to the user's camera and microphone
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                if (userVideo.current) {
                    userVideo.current.srcObject = stream;
                }
                setLocalStream(stream);
            })
            .catch(err => {
                console.error('Error accessing media devices.', err);
                toast.error('Error accessing media devices');
            });
    }, []); // Empty dependency array ensures this runs once on mount

    /*
    Funtion to get the number of users in the meeting.
    */
    const getUserCount = async () => {
        try {
            const response = await MeetingService.getUserCount();
            const count = response.data.count; // Make sure to access the count correctly
            return count;
        } catch (error) {
            console.error('An error occurred:', error);
        }
    
        return 0; // Return 0 in case of error
    }

    /**
     * Function to handle the action of hosting a meeting.
     * Emits a 'host' event via the socket connection if the user is not already hosting.
     */
    const handleHostMeeting = async () => {

        const userCount = await getUserCount();
        if (!userCount) {
            navigate('/meeting')
        };
    }

    /**
     * Function to handle the action of joining a meeting.
     * Emits a 'join' event via the socket connection if the user has not already joined.
     */
    const handleJoinMeeting = async () => {
        const userCount = await getUserCount();
        if (userCount) {
            navigate('/meeting')
        }
    };

    // Define routes for the application
    let routes = useRoutes([
        {
            path: "/",
            element: (
                <div className="App">
                    <main>
                        {/* User's video feed */}
                        <video ref={userVideo} id="userVideo" autoPlay muted></video>
                        <div>
                            {/* Buttons for hosting, joining, muting, and camera control */}
                            <button id="hostButton" onClick={handleHostMeeting}>Host Meeting</button>
                            <button id="joinButton" onClick={handleJoinMeeting}>Join Meeting</button>
                            <button id="muteButton" onClick={() => handleMuteUnmute()}>Mute/Unmute</button>
                            <button id="cameraButton" onClick={() => handleOpenCloseCamera(userVideo)}>Open/Close Camera</button>
                        </div>
                    </main>
                </div>
            ),
        },
        {
            path: "/meeting",
        },
    ]);

    return routes;

}


export default Lobby;
