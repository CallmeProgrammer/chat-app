const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store users: username -> socketId
let users = {};

io.on("connection", (socket) => {

  console.log("Connected:", socket.id);

  // When user joins
  socket.on("join", (username) => {

    users[username] = socket.id;

    console.log("Users:", users);

    io.emit("users", Object.keys(users));
  });

  // Send private message
  socket.on("private-message", ({ toUser, message, from }) => {

    const targetSocket = users[toUser];

    if (targetSocket) {

      io.to(targetSocket).emit("private-message", {
        from,
        message,
      });

    }

  });

  // When disconnect
  socket.on("disconnect", () => {

    for (let name in users) {
      if (users[name] === socket.id) {
        delete users[name];
      }
    }

    io.emit("users", Object.keys(users));
  });

});

server.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
