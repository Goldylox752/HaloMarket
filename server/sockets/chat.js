// =============================================
// Halo Marketplace
// server/sockets/chat.js
// Part 1 of 2
// =============================================

"use strict";

/*
|--------------------------------------------------------------------------
| Chat Socket Handler
|--------------------------------------------------------------------------
|
| Events
| ------
| chat:join
| chat:leave
| chat:send
| chat:typing
| chat:stopTyping
|
| Emits
| -----
| chat:joined
| chat:left
| chat:message
| chat:typing
| chat:error
|
*/

const mongoose = require("mongoose");

// Optional models (enable when available)
// const Conversation = require("../models/Conversation");
// const Message = require("../models/Message");

const MAX_MESSAGE_LENGTH = 2000;
const MAX_ROOM_NAME = 100;

// ======================================================
// Helpers
// ======================================================

function isValidRoom(roomId) {
    return (
        typeof roomId === "string" &&
        roomId.trim().length > 0 &&
        roomId.length <= MAX_ROOM_NAME
    );
}

function sanitizeMessage(text = "") {
    return String(text)
        .replace(/\r/g, "")
        .trim();
}

function validateMessage(text) {

    if (!text)
        return "Message cannot be empty.";

    if (typeof text !== "string")
        return "Invalid message.";

    if (text.length > MAX_MESSAGE_LENGTH)
        return `Message exceeds ${MAX_MESSAGE_LENGTH} characters.`;

    return null;
}

function createMessage(user, roomId, text) {

    return {
        _id: new mongoose.Types.ObjectId(),
        roomId,
        sender: {
            id: user.id,
            username: user.username,
            role: user.role
        },
        body: sanitizeMessage(text),
        createdAt: new Date(),
        edited: false
    };

}

// ======================================================
// Chat Handler
// ======================================================

module.exports = function registerChat(io, socket) {

    const user = socket.user;

    console.log(
        `Chat initialized for ${user.username}`
    );

    // ==========================================
    // Join Conversation
    // ==========================================

    socket.on("chat:join", async (roomId) => {

        try {

            if (!isValidRoom(roomId)) {

                return socket.emit("chat:error", {
                    message: "Invalid conversation."
                });

            }

            socket.join(roomId);

            socket.emit("chat:joined", {
                roomId,
                joinedAt: new Date()
            });

            socket.to(roomId).emit("chat:userJoined", {

                roomId,

                user: {
                    id: user.id,
                    username: user.username
                }

            });

            console.log(
                `${user.username} joined ${roomId}`
            );

        } catch (err) {

            console.error(err);

            socket.emit("chat:error", {
                message: "Unable to join conversation."
            });

        }

    });

    // ==========================================
    // Leave Conversation
    // ==========================================

    socket.on("chat:leave", (roomId) => {

        if (!isValidRoom(roomId)) return;

        socket.leave(roomId);

        socket.emit("chat:left", {
            roomId
        });

        socket.to(roomId).emit("chat:userLeft", {

            roomId,

            user: {
                id: user.id,
                username: user.username
            }

        });

    });

    // ==========================================
    // Typing Indicator
    // ==========================================

    socket.on("chat:typing", (roomId) => {

        if (!isValidRoom(roomId)) return;

        socket.to(roomId).emit("chat:typing", {

            roomId,

            user: {
                id: user.id,
                username: user.username
            }

        });

    });

    socket.on("chat:stopTyping", (roomId) => {

        if (!isValidRoom(roomId)) return;

        socket.to(roomId).emit("chat:stopTyping", {

            roomId,

            userId: user.id

        });

    });

    // ==========================================
    // Send Message
    // ==========================================

    socket.on("chat:send", async (payload) => {

        try {

            const roomId = payload.roomId;
            const text = sanitizeMessage(payload.message);

            if (!isValidRoom(roomId)) {

                return socket.emit("chat:error", {
                    message: "Invalid room."
                });

            }

            const validation = validateMessage(text);

            if (validation) {

                return socket.emit("chat:error", {
                    message: validation
                });

            }

            const message = createMessage(
                user,
                roomId,
                text
            );

            /*
            =======================================
            Save to database
            =======================================

            const saved = await Message.create({
                conversation: roomId,
                sender: user.id,
                message: text
            });

            message._id = saved._id;
            */

            io.to(roomId).emit(
                "chat:message",
                message
            );

            socket.emit("chat:sent", {

                roomId,

                messageId: message._id,

                createdAt: message.createdAt

            });

            console.log(
                `[CHAT] ${user.username}: ${text}`
            );

        } catch (err) {

            console.error(err);

            socket.emit("chat:error", {

                message: "Unable to send message."

            });

        }

    });

    // ==========================================
    // Read Receipts
    // ==========================================

    socket.on("chat:read", async (payload = {}) => {

        try {

            const { roomId, messageId } = payload;

            if (!isValidRoom(roomId) || !messageId) return;

            /*
            await Message.findByIdAndUpdate(messageId, {
                $addToSet: {
                    readBy: {
                        user: user.id,
                        readAt: new Date()
                    }
                }
            });
            */

            socket.to(roomId).emit("chat:read", {
                roomId,
                messageId,
                userId: user.id,
                readAt: new Date()
            });

        } catch (err) {

            console.error(err);

            socket.emit("chat:error", {
                message: "Unable to update read receipt."
            });

        }

    });

    // ==========================================
    // Delivered Receipt
    // ==========================================

    socket.on("chat:delivered", (payload = {}) => {

        const { roomId, messageId } = payload;

        if (!isValidRoom(roomId) || !messageId) return;

        socket.to(roomId).emit("chat:delivered", {
            roomId,
            messageId,
            deliveredBy: user.id,
            deliveredAt: new Date()
        });

    });

    // ==========================================
    // Edit Message
    // ==========================================

    socket.on("chat:edit", async (payload = {}) => {

        try {

            const { roomId, messageId, message } = payload;

            if (!isValidRoom(roomId) || !messageId) return;

            const validation = validateMessage(message);

            if (validation) {

                return socket.emit("chat:error", {
                    message: validation
                });

            }

            /*
            await Message.findByIdAndUpdate(messageId,{
                message,
                edited:true,
                updatedAt:new Date()
            });
            */

            io.to(roomId).emit("chat:edited", {

                roomId,

                messageId,

                message: sanitizeMessage(message),

                edited: true,

                updatedAt: new Date()

            });

        } catch (err) {

            console.error(err);

            socket.emit("chat:error", {
                message: "Unable to edit message."
            });

        }

    });

    // ==========================================
    // Delete Message
    // ==========================================

    socket.on("chat:delete", async (payload = {}) => {

        try {

            const { roomId, messageId } = payload;

            if (!roomId || !messageId) return;

            /*
            await Message.findByIdAndDelete(messageId);
            */

            io.to(roomId).emit("chat:deleted", {

                roomId,

                messageId,

                deletedBy: user.id

            });

        } catch (err) {

            console.error(err);

        }

    });

    // ==========================================
    // File / Image Attachment
    // ==========================================

    socket.on("chat:attachment", async (payload = {}) => {

        try {

            const { roomId, file } = payload;

            if (!roomId || !file) return;

            io.to(roomId).emit("chat:attachment", {

                _id: new mongoose.Types.ObjectId(),

                roomId,

                sender: {
                    id: user.id,
                    username: user.username
                },

                file,

                createdAt: new Date()

            });

        } catch (err) {

            console.error(err);

        }

    });

    // ==========================================
    // Message Reactions
    // ==========================================

    socket.on("chat:reaction", (payload = {}) => {

        const { roomId, messageId, reaction } = payload;

        if (!roomId || !messageId || !reaction) return;

        io.to(roomId).emit("chat:reaction", {

            roomId,

            messageId,

            reaction,

            userId: user.id,

            username: user.username

        });

    });

    // ==========================================
    // Conversation History
    // ==========================================

    socket.on("chat:history", async (payload = {}) => {

        try {

            const { roomId } = payload;

            if (!roomId) return;

            /*
            const history = await Message.find({
                conversation: roomId
            })
            .sort({createdAt:1})
            .limit(100);

            socket.emit("chat:history",history);
            */

            socket.emit("chat:history", []);

        } catch (err) {

            console.error(err);

        }

    });

    // ==========================================
    // User Presence
    // ==========================================

    socket.on("chat:status", (status = "online") => {

        io.emit("chat:userStatus", {

            userId: user.id,

            username: user.username,

            status,

            updatedAt: new Date()

        });

    });

    // ==========================================
    // Disconnect Cleanup
    // ==========================================

    socket.on("disconnect", () => {

        console.log(
            `Chat disconnected: ${user.username}`
        );

    });

};
