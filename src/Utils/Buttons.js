/**
 * Toggles the mute state of the user's audio track in the provided media stream.
 *
 * @param {MediaStream} stream The media stream containing the user's audio track.
 */
const handleMuteUnmute = () => {
    // if (stream) {
    //     // Toggle the enabled state of the first audio track in the stream
    //     stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
    // }
};

/**
 * Toggles the open/close state of the user's camera.
 *
 * @param {React.RefObject} videoRef A React ref to the video element showing the user's camera feed.
 */
const handleOpenCloseCamera = (videoRef) => {
    if (videoRef.current && videoRef.current.srcObject) {
        // Get the current state of the first video track's enabled property
        const enabled = videoRef.current.srcObject.getVideoTracks()[0].enabled;
        // Toggle the enabled state of the first video track in the stream
        videoRef.current.srcObject.getVideoTracks()[0].enabled = !enabled;
    }
};

export { handleMuteUnmute, handleOpenCloseCamera };
