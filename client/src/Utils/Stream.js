const addRemoteStream = (newStream, newPeerId, setRemoteStreams) => {
    setRemoteStreams(prevStreams => {
        // Check if the peer ID already exists in the array
        const existingStreamIndex = prevStreams.findIndex(stream => stream.id === newPeerId);
        if (existingStreamIndex !== -1) {
            // Replace the existing stream's object to update it
            return prevStreams.map((stream, index) => {
                if (index === existingStreamIndex) {
                    return { id: newPeerId, stream: newStream };
                }
                return stream;
            });
        } else {
            // Add the new stream if the peer ID doesn't exist
            return [...prevStreams, { id: newPeerId, stream: newStream }];
        }
    });
};

// Function to remove a remote stream
const removeRemoteStream = (leftPeerId, setRemoteStreams) => {
    setRemoteStreams(prevStreams => prevStreams.filter(stream => stream.id !== leftPeerId));
  };

export { addRemoteStream, removeRemoteStream };