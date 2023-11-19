import Peer from 'peerjs';

export const createPeerConnection = (localStream, onRemoteStream, socket) => {
    // Create a new Peer instance
    const peer = new Peer({
        // Optional: Provide your own PeerServer configuration
    });

    peer.on('open', (id) => {
        console.log(`My peer ID is: ${id}`);
        // Notify the server about this new peer ID
        socket.emit('register-peer-id', { peerId: id });
    });

    // Handle incoming calls
    peer.on('call', (call) => {
        call.answer(localStream); // Answer the call with the local stream
        call.on('stream', (remoteStream) => {
            // Handle the remote stream here
            onRemoteStream(remoteStream, call.peer);
        });
    });

    // Handle errors
    peer.on('error', (err) => {
        console.error('PeerJS error:', err);
    });

    return peer;
};
