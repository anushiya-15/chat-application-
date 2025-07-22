const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Socket.io setup
io.on("connection", (socket) => {
    socket.on("newuser", (username) => {
        socket.broadcast.emit("update", `${username} has joined the chat.`);
    });

    socket.on("chat", (message) => {
        socket.broadcast.emit("chat", message);
    });

    socket.on("exituser", (username) => {
        socket.broadcast.emit("update", `${username} has left the chat.`);
    });
});

// Start server
http.listen(5000, () => {
    console.log("✅ Server running at http://localhost:5000");
});
