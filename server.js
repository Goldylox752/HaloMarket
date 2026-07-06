// ========================================
// Halo Marketplace
// server.js
// ========================================

require("dotenv").config();

const http = require("http");
const app = require("./app");
const { connectDatabase } = require("./config/database");

// ========================================
// CONFIG
// ========================================

const PORT = process.env.PORT || 5000;

// ========================================
// START SERVER
// ========================================

async function startServer() {
    try {
        // Connect database (PostgreSQL / Supabase)
        await connectDatabase();

        const server = http.createServer(app);

        server.listen(PORT, () => {
            logStartup();
        });

        // Graceful shutdown support
        handleShutdown(server);

    } catch (err) {
        console.error("❌ Failed to start server:", err.message);
        process.exit(1);
    }
}

// ========================================
// STARTUP LOGS
// ========================================

function logStartup() {
    console.log("\n======================================");
    console.log("🚀 Halo Marketplace API");
    console.log("======================================");
    console.log(`Environment : ${process.env.NODE_ENV || "development"}`);
    console.log(`Server      : http://localhost:${PORT}`);
    console.log("======================================\n");
}

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

function handleShutdown(server) {
    const shutdown = async (signal) => {
        console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);

        try {
            server.close(() => {
                console.log("🛑 HTTP server closed");
                process.exit(0);
            });
        } catch (err) {
            console.error("Shutdown error:", err.message);
            process.exit(1);
        }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}

// ========================================
// BOOT
// ========================================

startServer();