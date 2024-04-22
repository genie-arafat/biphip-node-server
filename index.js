const express = require("express");
const app = express();
const http = require("http").Server(app);
const socketIO = require("socket.io")(http);
const cors = require("cors");

const PORT = 4000;

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Socket.io connection handling
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // Wildcard event listener for any event not explicitly handled
  socket.onAny((event, ...args) => {
    // Broadcast the event to all clients except the sender
    socket.broadcast.emit(event, ...args);
  });

  // Handle specific socket.io events
  socket.on("peerRequest", (data) => {
    console.log(data);
    socketIO.emit("peerRequestIncoming", data);
  });

  socket.on("peerRequestSuccess", (data) => {
    console.log("peerRequestSuccess: ", data);
    socketIO.emit("peerRequestSuccess", data);
  });

  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

// Define a simple API endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

// Start the server
http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
