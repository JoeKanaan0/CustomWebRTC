import React from 'react';

function ControlPanel({ onHost, onJoin, onMuteUnmute, onToggleCamera }) {
  return (
    <div>
      <button onClick={onHost}>Host Meeting</button>
      <button onClick={onJoin}>Join Meeting</button>
      <button onClick={onMuteUnmute}>Mute/Unmute</button>
      <button onClick={onToggleCamera}>Open/Close Camera</button>
    </div>
  );
}

export default ControlPanel;
