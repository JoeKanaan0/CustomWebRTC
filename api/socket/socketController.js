module.exports = function (io, incrementUserCount, decrementUserCount) {
    let hostId = null;
    let userCount = 0;
    let connectedSockets = new Set(); // Store connected socket IDs

    io.on('connection', (socket) => {

        // Emit existing socket IDs to the newly connected user
        socket.emit('existing-users', Array.from(connectedSockets));

        // Notify other users about the new connection
        socket.broadcast.emit('user-joined', socket.id);

        connectedSockets.add(socket.id); // Add new socket ID to the set
        incrementUserCount(); // Increment user count on new connection
        userCount++;
        io.emit('user-count-updated', userCount); // Emit an event with the new count

        if (!hostId) {
            console.log("Meeting Hosted");
            hostId = socket.id;
            socket.emit('host');
        }


        if (hostId) {
            console.log("User Joined");
            socket.emit('join');
        }

        socket.on('message', (message) => {
            if (socket.id === hostId) {
                socket.broadcast.emit('message', message);
            }
        });

        socket.on('disconnect', () => {
            connectedSockets.delete(socket.id); // Remove socket ID from the set
            decrementUserCount();
            userCount--;
            io.emit('user-count-updated', userCount); // Emit an event with the new count
            console.log("Disconnected");

            if (socket.id === hostId) {
                hostId = null;
                io.emit('host-left');
            }

            // Notify other users about the disconnection
            socket.broadcast.emit('user-left', socket.id);
        });
    });
};