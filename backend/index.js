require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

// Load environment variables
const port = process.env.PORT || 5000;
const mongoUri = process.env.URI;

// Import routers and models
const documentRouter = require("./router/documentsRouter/documentsRouter");
const Message = require("./database/messages/messagesData");
const userRouter = require("./router/usersRouter/userRouter");
const messageRouter = require("./router/messagesRouter/messagesRouter");

// Create HTTP server and WebSocket server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust to your frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/documents", documentRouter);
app.use("/auth/users", userRouter);
app.use("/messages", messageRouter);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinDocument", (documentId) => {
    socket.join(documentId);
    console.log(`Client joined document room: ${documentId}`);
  });

  socket.on("leaveDocument", (documentId) => {
    socket.leave(documentId);
    console.log(`Client left document room: ${documentId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const message = new Message(data);
      await message.save();
      io.to(data.documentId).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error saving message: ", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// MongoDB connection
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully");
    server.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error: ", error);
  });
