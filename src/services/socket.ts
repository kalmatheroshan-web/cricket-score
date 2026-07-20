import { io } from "socket.io-client";

const SOCKET_URL = "https://iguana-unstaffed-tying.ngrok-free.dev";

export const socket = io(SOCKET_URL, {
    transports: ["websocket"], 
    autoConnect: false,
});