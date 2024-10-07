// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const dgram = require('dgram');

// Create an Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files (the frontend)
app.use(express.static('public'));

// Create a UDP socket for receiving messages from other UDP clients
const udpServer = dgram.createSocket('udp4');

// UDP port for sending/receiving messages
const UDP_PORT = 41234;
const UDP_HOST = 'localhost';

// When the UDP server receives a message, broadcast it to all connected WebSocket clients
udpServer.on('message', (msg, rinfo) => {
  console.log(`UDP Message from ${rinfo.address}:${rinfo.port}: ${msg}`);
  io.emit('chat message', msg.toString()); // Broadcast the message to all WebSocket clients
});

// Bind UDP server to the port
udpServer.bind(UDP_PORT, () => {
  console.log(`UDP Server listening on port ${UDP_PORT}`);
});

// WebSocket communication
io.on('connection', (socket) => {
  console.log('A user connected');

  // When a new message is received from the frontend, send it via UDP
  socket.on('chat message', (msg) => {
    const message = Buffer.from(msg);
    udpServer.send(message, 0, message.length, UDP_PORT, UDP_HOST, (err) => {
      if (err) console.error(err);
      console.log(`Sent UDP message: ${msg}`);
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the HTTP server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});
