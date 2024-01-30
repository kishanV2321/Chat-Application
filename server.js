const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
// const io = new Server(server);
const io = new Server(server, {
    cors: {
        origin: "*", // Replace with your client's origin
        methods: ['GET', 'POST'],
    },
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


const users = {};


io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        console.log("New User", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    socket.on('disconnect', (message) => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

// server.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });

server.listen(3000,'192.168.5.42', () => {
    console.log('Server is running on http://192.168.5.42:3000');
});


