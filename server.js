const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://vcw-frontend.vercel.app"], // Your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ id }) => {
    console.log(`${socket.id} joined room: ${id}`);
    socket.join(id);
    socket.broadcast.to(id).emit("user-joined", socket.id);
  });

  socket.on("offer", (data) => {
    console.log(`${socket.id} offer to ${data.to}`)
    socket.to(data.to).emit("offer", {
      from: socket.id,
      offer: data.offer,
    });
  });

  socket.on("answer", (data) => {
    console.log(`${socket.id} answer to ${data.to}`)
    socket.to(data.to).emit("answer", {
      from: socket.id,
      answer: data.answer,
    });
  });

  socket.on("candidate", (data) => {
    console.log(`${socket.id} candidate to ${data.to}`)
    socket.to(data.to).emit("candidate", {
      from: socket.id,
      candidate: data.candidate,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
