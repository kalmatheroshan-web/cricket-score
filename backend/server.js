const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const connect = require('./config/mongo');
const cors = require('cors');
const userRouter = require("./routes/userRoute");
const teamRouter = require("./routes/teamRoute");
 
app.use(express.json());
app.use(cors());

connect();
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("sendMessage", (data) => {
        console.log(data);

        io.emit("newMessage", data); // send to everyone
    });

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });
});


app.get('/', (req, res)=>{
    console.log("user hit default route",req.hostname);
    res.status(200).send({success : true, msg:'app server is running'});
})

app.use('/api/auth', userRouter);
app.use('/api/teams', teamRouter);



require('dotenv').config(); 
server.listen(process.env.PORT, () => {
    console.log("Server running on port", Number(process.env.PORT));
});