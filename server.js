const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();

const server = http.createServer(app);

// CORS setup
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

// Create HTTP server and Socket.IO server
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Listening on Port 3000');
});