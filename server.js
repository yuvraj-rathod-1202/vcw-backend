const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); // Import cors

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors({
  origin: ["https://vcw-frontend.vercel.app", "http://localhost:3000"], // Allow only your React app to access
  methods: ["GET", "POST"], // Allowed HTTP methods
  credentials: true // Allow cookies if needed
}));

const io = new Server(server, {
  cors: {
    origin: ["https://vcw-frontend.vercel.app", "http://localhost:3000"], // Allow React app
    methods: ["GET", "POST"], // Same methods as above
    credentials: true,
  },
});

app.get('/', (req, res) => {
  res.send("Hello, World!");
})

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("offer", (data) => {
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });

  socket.on("candidate", (data) => {
    socket.broadcast.emit("candidate", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
