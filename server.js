const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); // Import cors

const app = express();
const server = http.createServer(app);




// Enable CORS
app.use(cors({
  origin: ["http://localhost:3000", "https://vcw-frontend.vercel.app"], // Allow only your React app to access //"https://vcw-frontend.vercel.app", 
  methods: ["GET", "POST"], // Allowed HTTP methods
  credentials: true // Allow cookies if needed
}));

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://vcw-frontend.vercel.app"], // Allow React app
    methods: ["GET", "POST"], // Same methods as above
    credentials: true,
  },
  transports: ["websocket", "polling"]
});

app.get('/', (req, res) => {
  res.send("Hello, World!");
})

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", (roomId) => {
    socket.join(roomId.id);
    console.log(`${socket.id} joined room: ${roomId.id}`);
  });

  socket.on("offer", (data) => {
    socket.broadcast.to(data.roomId.id).emit("offer", data.offer);
  });

  socket.on("answer", (data) => {
    socket.broadcast.to(data.roomId.id).emit("answer", data.answer);
  });

  socket.on("candidate", (data) => {
    socket.broadcast.to(data.roomId.id).emit("candidate", data.candidate);
  });

  socket.on("leave-room", () => {
    socket.broadcast.emit("leave-room")
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});