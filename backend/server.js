require('dotenv').config();

const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const connect = require('./config/mongo');
const cors = require('cors');
const userRouter = require("./routes/userRoute");
const teamRouter = require("./routes/teamRoute");
const matchRouter = require("./routes/matchRoute");
const { initSocket } = require("./sockets/socket_connect");

// Standard Middlewares
app.use(express.json());
app.use(cors());

// Initialize MongoDB & Socket.IO
connect();
initSocket(server); 

// Healthcheck Route
app.get('/', (req, res) => {
    console.log("User hit default route:", req.hostname);
    res.status(200).send({ success: true, msg: 'App server is running' });
});

// API Routes
app.use('/api/auth', userRouter);
app.use('/api/teams', teamRouter);
app.use('/api/matches', matchRouter);

// Start Server
const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});