const { Server } = require("socket.io");

let io;

function initSocket(server) {
    // Attach Socket.IO to the main HTTP server instance
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // Join a specific match room
        socket.on("join_match", (matchId) => {
            socket.join(matchId);
            console.log(`Socket ${socket.id} joined match room: ${matchId}`);
        });

        // Leave a specific match room
        socket.on("leave_match", (matchId) => {
            socket.leave(matchId);
            console.log(`Socket ${socket.id} left match room: ${matchId}`);
        });

        // Handle score updates sent directly over WebSocket
        socket.on("update_score", (data) => {
            console.log("Score update received via socket:", data);

            if (data.matchId) {
                // Broadcast to everyone in that match room (except the sender)
                socket.to(data.matchId).emit("score_update", data);
            } else {
                socket.broadcast.emit("score_update", data);
            }
        });

        socket.on("disconnect", () => {
            console.log("Disconnected:", socket.id);
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}

module.exports = { initSocket, getIO };