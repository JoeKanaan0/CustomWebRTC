import React from 'react';

function VideoDisplay({ videoRef, id, muted }) {
  return <video ref={videoRef} id={id} autoPlay muted={muted}></video>;
}

export default VideoDisplay;
