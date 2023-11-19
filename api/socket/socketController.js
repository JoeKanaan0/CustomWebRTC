module.exports = function (io, incrementUserCount, decrementUserCount) {
    let hostId = null;
    let userCount = 0;
    let connectedSockets = new Map(); // Use a Map to store connected socket IDs and their PeerJS IDs

    io.on('connection', (socket) => {

        // // Send existing user PeerJS IDs to the newly connected user
        // const existingUsers = Array.from(connectedSockets.entries())
        //                            .filter(([id, _]) => id !== socket.id)
        //                            .map(([_, peerId]) => peerId);

        // socket.emit('existing-users', existingUsers);

        incrementUserCount(); // Increment user count on new connection
        userCount++;
        io.emit('user-count-updated', userCount); // Emit an event with the new count

        // Listen for PeerJS ID registration
        socket.on('register-peer-id', data => {
            const peerId = data.peerId;
            connectedSockets.set(socket.id, peerId); // Store the PeerJS ID against the socket ID

            // Notify other users about the new PeerJS ID
            socket.broadcast.emit('new-user-joined', peerId);
        });

        if (!hostId) {
            console.log("Meeting Hosted");
            hostId = socket.id;
            socket.emit('host');
        }


        if (hostId) {
            console.log("User Joined");
            socket.emit('join');
        }

        socket.on('disconnect', () => {
            const leavingPeerId = connectedSockets.get(socket.id);
            connectedSockets.delete(socket.id); // Remove socket ID and PeerJS ID from the map

            decrementUserCount();
            userCount--;
            io.emit('user-count-updated', userCount); // Emit an event with the new count

            // Notify other users about the disconnection
            socket.broadcast.emit('user-left', leavingPeerId);

            console.log("Disconnected");

            if (socket.id === hostId) {
                hostId = null;
                io.emit('host-left');
            }

        });
    });
};