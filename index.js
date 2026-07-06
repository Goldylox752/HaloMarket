// ==========================================
// HALO MARKETPLACE - SERVER
// index.js
// ==========================================

require("dotenv").config();

const express = require("express");
const path = require("path");

const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const { PrismaClient } = require("@prisma/client");
const logger = require("./utils/logger");

// ==========================================
// INIT
// ==========================================

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "*";

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

app.set("trust proxy", 1);

app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
    })
);

// ==========================================
// GENERAL MIDDLEWARE
// ==========================================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression());
app.use(morgan("dev"));

// ==========================================
// STATIC FILES (FRONTEND)
// ==========================================

app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// API ROUTES
// ==========================================

const routes = [
    { path: "/api/auth", file: "./routes/auth" },
    { path: "/api/users", file: "./routes/users" },
    { path: "/api/products", file: "./routes/products" },
    { path: "/api/categories", file: "./routes/categories" },
    { path: "/api/orders", file: "./routes/orders" },
    { path: "/api/payments", file: "./routes/payments" },
    { path: "/api/vendors", file: "./routes/vendors" },
    { path: "/api/reviews", file: "./routes/reviews" },
    { path: "/api/messages", file: "./routes/messages" },
    { path: "/api/search", file: "./routes/search" },
    { path: "/api/admin", file: "./routes/admin" },
    { path: "/api/uploads", file: "./routes/uploads" },
];

routes.forEach((route) => {
    app.use(route.path, require(route.file));
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return res.json({
            success: true,
            app: "Halo Marketplace",
            status: "healthy",
            database: "connected",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        });

    } catch (err) {
        logger.error("Health check failed:", err.message);

        return res.status(500).json({
            success: false,
            status: "unhealthy",
            database: "disconnected",
        });
    }
});

// ==========================================
// SPA FALLBACK (FRONTEND ROUTING)
// ==========================================

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {
    logger.error(err.stack || err.message);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// ==========================================
// START SERVER
// ==========================================

async function startServer() {
    try {
        await prisma.$connect();

        logger.success("Database connected");
        logger.success(`Environment: ${process.env.NODE_ENV || "development"}`);

        app.listen(PORT, () => {
            logger.success("====================================");
            logger.success("Halo Marketplace API Running");
            logger.success(`http://localhost:${PORT}`);
            logger.success("====================================");
        });

    } catch (err) {
        logger.error("Failed to start server:", err.message);
        process.exit(1);
    }
}

startServer();

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

async function shutdown(signal) {
    logger.warn(`Received ${signal}. Shutting down gracefully...`);

    try {
        await prisma.$disconnect();
        process.exit(0);
    } catch (err) {
        logger.error("Shutdown error:", err.message);
        process.exit(1);
    }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// ==========================================
// GLOBAL ERROR HANDLERS
// ==========================================

process.on("unhandledRejection", (err) => {
    logger.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception:", err);
    process.exit(1);
});