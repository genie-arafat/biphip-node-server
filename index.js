const express = require("express");
const app = express();
const PORT = 4000;

//New imports
const http = require("http").Server(app);
const cors = require("cors");

// app.use(cors());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to the origin of your frontend application
    methods: ["GET", "POST"], // Add the HTTP methods your client uses
    allowedHeaders: ["my-custom-header"], // Add any custom headers your client might send
    credentials: true,
  },
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // Wildcard event listener for any event not explicitly handled
  socket.onAny((event, ...args) => {
    // Broadcast the event to all clients except the sender
    socket.broadcast.emit(event, ...args);

    // Optionally, to include the sender as well, use io.emit
    // io.emit(event, ...args);
  });

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

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
