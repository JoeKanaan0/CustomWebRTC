import React, { createContext, useState, useContext } from 'react';

const StreamContext = createContext();

export const useStream = () => useContext(StreamContext);

export const StreamProvider = ({ children }) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStreams, setRemoteStreams] = useState([]);

    return (
        <StreamContext.Provider value={{ localStream, setLocalStream, remoteStreams, setRemoteStreams }}>
            {children}
        </StreamContext.Provider>
    );
};