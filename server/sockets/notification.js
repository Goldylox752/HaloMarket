// =============================================
// Halo Marketplace
// server/sockets/notification.js
// Part 1 of 2
// =============================================

"use strict";

/*
|--------------------------------------------------------------------------
| Notification Socket Handler
|--------------------------------------------------------------------------
|
| Events
| ------
| notification:subscribe
| notification:send
| notification:markRead
| notification:markAllRead
| notification:count
|
| Emits
| -----
| notification:new
| notification:updated
| notification:count
| notification:error
|
*/

// Optional database model
// const Notification = require("../models/Notification");

const MAX_TITLE_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 500;

// ======================================================
// Notification Types
// ======================================================

const TYPES = {
    MESSAGE: "message",
    ORDER: "order",
    PAYMENT: "payment",
    PRODUCT: "product",
    REVIEW: "review",
    SYSTEM: "system",
    PROMOTION: "promotion",
    VENDOR: "vendor",
    ADMIN: "admin"
};

// ======================================================
// Helpers
// ======================================================

function sanitize(value = "") {
    return String(value).trim();
}

function validateNotification(title, message) {

    if (!title || !message)
        return "Title and message are required.";

    if (title.length > MAX_TITLE_LENGTH)
        return "Title is too long.";

    if (message.length > MAX_MESSAGE_LENGTH)
        return "Message is too long.";

    return null;

}

function buildNotification(userId, data = {}) {

    return {

        _id: Date.now().toString(36) + Math.random().toString(36).substring(2),

        userId,

        title: sanitize(data.title),

        message: sanitize(data.message),

        type: data.type || TYPES.SYSTEM,

        url: data.url || null,

        icon: data.icon || "bell",

        read: false,

        createdAt: new Date()

    };

}

// ======================================================
// Notification Handler
// ======================================================

module.exports = function registerNotification(io, socket) {

    const user = socket.user;

    console.log(
        `Notifications ready for ${user.username}`
    );

    // Personal notification room
    socket.join(`notifications:${user.id}`);

    // ==========================================
    // Subscribe
    // ==========================================

    socket.on("notification:subscribe", () => {

        socket.join(`notifications:${user.id}`);

        socket.emit("notification:subscribed", {

            success: true,

            userId: user.id,

            subscribedAt: new Date()

        });

    });

    // ==========================================
    // Send Notification
    // ==========================================

    socket.on("notification:send", async (payload = {}) => {

        try {

            const validation = validateNotification(
                payload.title,
                payload.message
            );

            if (validation) {

                return socket.emit(
                    "notification:error",
                    { message: validation }
                );

            }

            const notification = buildNotification(
                payload.userId,
                payload
            );

            /*
            await Notification.create(notification);
            */

            io.to(`notifications:${payload.userId}`).emit(
                "notification:new",
                notification
            );

            socket.emit("notification:sent", {

                success: true,

                id: notification._id

            });

        } catch (err) {

            console.error(err);

            socket.emit("notification:error", {

                message: "Unable to send notification."

            });

        }

    });

    // ==========================================
    // Mark Notification Read
    // ==========================================

    socket.on("notification:markRead", async (notificationId) => {

        try {

            if (!notificationId) return;

            /*
            await Notification.findByIdAndUpdate(
                notificationId,
                {
                    read: true,
                    readAt: new Date()
                }
            );
            */

            socket.emit("notification:updated", {

                id: notificationId,

                read: true,

                readAt: new Date()

            });

        } catch (err) {

            console.error(err);

        }

    });

    // ==========================================
    // Mark All Read
    // ==========================================

    socket.on("notification:markAllRead", async () => {

        try {

            /*
            await Notification.updateMany(
                {
                    userId: user.id,
                    read: false
                },
                {
                    read: true,
                    readAt: new Date()
                }
            );
            */

            socket.emit("notification:allRead", {

                success: true,

                completedAt: new Date()

            });

        } catch (err) {

            console.error(err);

        }

    });

    // ==========================================
    // Unread Count
    // ==========================================

    socket.on("notification:count", async () => {

        try {

            /*
            const count =
                await Notification.countDocuments({
                    userId: user.id,
                    read: false
                });
            */

            const count = 0;

            socket.emit("notification:count", {

                unread: count

            });

        } catch (err) {

            console.error(err);

        }

    });

    // ==========================================
    // Vendor Notification
    // ==========================================

    socket.on("notification:vendor", (payload = {}) => {

        if (!payload.vendorId) return;

        io.to(`notifications:${payload.vendorId}`).emit(
            "notification:new",
            buildNotification(payload.vendorId, {
                title: payload.title || "Vendor Notification",
                message: payload.message || "",
                type: TYPES.VENDOR,
                url: payload.url
            })
        );

    });

    // ==========================================
    // Customer Notification
    // ==========================================

    socket.on("notification:customer", (payload = {}) => {

        if (!payload.customerId) return;

        io.to(`notifications:${payload.customerId}`).emit(
            "notification:new",
            buildNotification(payload.customerId, {
                title: payload.title || "Notification",
                message: payload.message || "",
                type: TYPES.SYSTEM,
                url: payload.url
            })
        );

    });

// ==========================================
// Admin Notifications
// ==========================================

    socket.on("notification:admin", (payload = {}) => {

        if (!payload.message) return;

        io.emit("notification:admin", {
            title: payload.title || "Administrator",
            message: payload.message,
            type: TYPES.ADMIN,
            createdAt: new Date()
        });

    });

    // ==========================================
    // Order Notifications
    // ==========================================

    socket.on("notification:order", (payload = {}) => {

        if (!payload.userId) return;

        const notification = buildNotification(payload.userId, {
            title: payload.title || "Order Update",
            message: payload.message || "Your order has been updated.",
            type: TYPES.ORDER,
            url: payload.url
        });

        io.to(`notifications:${payload.userId}`)
            .emit("notification:new", notification);

    });

    // ==========================================
    // Payment Notifications
    // ==========================================

    socket.on("notification:payment", (payload = {}) => {

        if (!payload.userId) return;

        const notification = buildNotification(payload.userId, {
            title: payload.title || "Payment Received",
            message: payload.message || "Your payment has been processed.",
            type: TYPES.PAYMENT,
            url: payload.url
        });

        io.to(`notifications:${payload.userId}`)
            .emit("notification:new", notification);

    });

    // ==========================================
    // Product Notifications
    // ==========================================

    socket.on("notification:product", (payload = {}) => {

        if (!payload.userId) return;

        const notification = buildNotification(payload.userId, {
            title: payload.title || "Product Update",
            message: payload.message || "A product has been updated.",
            type: TYPES.PRODUCT,
            url: payload.url
        });

        io.to(`notifications:${payload.userId}`)
            .emit("notification:new", notification);

    });

    // ==========================================
    // Review Notifications
    // ==========================================

    socket.on("notification:review", (payload = {}) => {

        if (!payload.userId) return;

        const notification = buildNotification(payload.userId, {
            title: payload.title || "New Review",
            message: payload.message || "Your product received a new review.",
            type: TYPES.REVIEW,
            url: payload.url
        });

        io.to(`notifications:${payload.userId}`)
            .emit("notification:new", notification);

    });

    // ==========================================
    // Promotion Notifications
    // ==========================================

    socket.on("notification:promotion", (payload = {}) => {

        io.emit("notification:new", {
            _id: Date.now().toString(),
            title: payload.title || "Marketplace Promotion",
            message: payload.message || "",
            type: TYPES.PROMOTION,
            url: payload.url || null,
            read: false,
            createdAt: new Date()
        });

    });

    // ==========================================
    // System Announcement
    // ==========================================

    socket.on("notification:system", (payload = {}) => {

        io.emit("notification:system", {
            title: payload.title || "System Notification",
            message: payload.message || "",
            type: TYPES.SYSTEM,
            createdAt: new Date()
        });

    });

    // ==========================================
    // Broadcast Helper
    // ==========================================

    socket.on("notification:broadcast", (payload = {}) => {

        io.emit("notification:new", {
            title: payload.title || "Announcement",
            message: payload.message || "",
            type: payload.type || TYPES.SYSTEM,
            createdAt: new Date()
        });

    });

    // ==========================================
    // Disconnect
    // ==========================================

    socket.on("disconnect", (reason) => {

        console.log(
            `[Notification] ${user.username} disconnected (${reason})`
        );

    });

    // ==========================================
    // Socket Error
    // ==========================================

    socket.on("error", (err) => {

        console.error(
            `[Notification] ${user.username}:`,
            err
        );

    });

};
