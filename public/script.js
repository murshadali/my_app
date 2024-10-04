// Establish WebSocket connection using Socket.io
const socket = io();

// Form and message input elements
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');

// When the user submits a message
form.addEventListener('submit', function(event) {
  event.preventDefault();
  if (input.value) {
    // Send the message to the server
    socket.emit('chat message', input.value);

    // Clear the input field
    input.value = '';
  }
});

// When a message is received from the server, display it
socket.on('chat message', function(msg) {
  const messageElement = document.createElement('div');
  messageElement.textContent = msg;
  messages.appendChild(messageElement);

  // Auto-scroll to the bottom of the message list
  messages.scrollTop = messages.scrollHeight;
});
