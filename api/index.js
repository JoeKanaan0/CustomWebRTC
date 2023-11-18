// Import the necessary modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create a new express application
const app = express();

// Create a new http server and wrap the express app
const server = http.createServer(app);

// Create a new Socket.IO instance
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Enable CORS and parse request bodies
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let userCount = 0; // Shared variable to store user count

// Pass the reference of `userCount` to `socketController`
require('./socket/socketController')(io, () => userCount++ , () => userCount--);

// Endpoint to get the current user count
app.get('/user-count', (req, res) => {
    res.json({ count: userCount });
});

// Start the server on port 3001
server.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
