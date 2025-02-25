import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './lib/db.js'
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js'
import cookieParser from "cookie-parser";
import cors from 'cors';
import bodyParser from "body-parser";
import { app,server } from './lib/socket.js';

import path from 'path';


dotenv.config();


app.use(express.json({ limit: "10mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const ROUTE = process.env.PORT || "http://localhost:3000";

const __dirname = path.resolve();

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,"../Forntend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../Forntend","dist","index.html"))
    })
}

server.listen(ROUTE, () => {
    console.log("Server is running on port" + ROUTE);
    connectDB()
})