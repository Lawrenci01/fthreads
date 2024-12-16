import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app);
const userSocketMap = {}; // userId: socketId

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:3007",
        methods: ["GET", "POST"],
    },
});

// Utility to get recipient's socket ID
export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId];
};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected", { socketId: socket.id, userId });

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
        try {
            await Message.updateMany({ conversationId, seen: false }, { $set: { seen: true } });
            await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
            const recipientSocket = userSocketMap[userId];
            if (recipientSocket) {
                io.to(recipientSocket).emit("messagesSeen", { conversationId });
            }
        } catch (error) {
            console.error("Error in markMessagesAsSeen:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", { socketId: socket.id, userId });
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

export { io, server, app };
