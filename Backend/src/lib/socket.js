import {Server} from "socket.io";
import http from "http";
import express from "express";

const app=express();

const server = http.createServer(app);

const io = new Server(server , {
    cors:{
        origin: ["http://localhost:5173"]
    },
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

//used to store online users
const userSocketMap = {};

io.on("connection",(socket) => {
    console.log("A new client connected",socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id;

    io.emit("OnlineUsers", Object.keys(userSocketMap));//boardcast to every user that a user is online

    socket.on("disconnect",()=>{
        console.log("A client disconnected",socket.id);
        delete userSocketMap[userId];
        io.emit("OnlineUsers", Object.keys(userSocketMap));
    });
});

export { io , app , server}