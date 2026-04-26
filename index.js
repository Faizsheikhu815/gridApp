const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// MongoDB connect
mongodb+srv; //Faiz_sheikh:<F804404z@>@cluster0.76bslr7.mongodb.net/?appName=Cluster0

// Schema
const cellSchema = new mongoose.Schema({
  cellId: String,
  owner: String,
  color: String
});

const Cell = mongoose.model("Cell", cellSchema);

// Socket logic
io.on("connection", async (socket) => {
  console.log("User connected");

  // Send initial grid
  const cells = await Cell.find();
  socket.emit("initGrid", cells);

  // Handle claim
  socket.on("claimCell", async ({ cellId, user, color }) => {
    const exists = await Cell.findOne({ cellId });

    if (!exists) {
      const newCell = await Cell.create({ cellId, owner: user, color });

      // Broadcast to all users
      io.emit("updateCell", newCell);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => console.log("Server running on 5000"));