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

app.use('/', (req, res) => {
  res.send('Server is running.');
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

  socket.on("sentmessagetoroom", (data) => {
    console.log(`${socket.id} sent message to room: ${data.roomId}`);
    socket.broadcast.to(data.roomId).emit("getmessagefromroom", {
      from: socket.id,
      message: data.message,
    });
  })

  socket.on("leave-room", (data) => {
    console.log(`${socket.id} left room: ${data.roomId}`);
    socket.broadcast.to(data.roomId).emit("user-left", socket.id);
    socket.leave(data.roomId);
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
