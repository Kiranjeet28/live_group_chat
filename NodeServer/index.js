const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

// Manually set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    credentials: true,
    allowEIO3: true,
  },
});

const users = {};

io.on('connection', (socket) => {
  socket.on('New-User', (name) => {
    console.log('New User here',name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined',name);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

socket.on('disconnect', (name) => {
  socket.broadcast.emit('leave',{name : users[socket.id]});
  delete users[socket.id];
});
});



const port = 4000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
