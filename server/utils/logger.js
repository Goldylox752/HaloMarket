// ==========================================
// HALO MARKETPLACE LOGGER
// utils/logger.js
// ==========================================

const fs = require("fs");
const path = require("path");

// ==========================================
// LOG DIRECTORY
// ==========================================

const logDir = path.join(__dirname, "../logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// ==========================================
// LOG FILES
// ==========================================

const appLog = path.join(logDir, "app.log");
const errorLog = path.join(logDir, "error.log");

// ==========================================
// TIMESTAMP
// ==========================================

function timestamp() {
    return new Date().toISOString();
}

// ==========================================
// WRITE LOG
// ==========================================

function write(file, level, message) {

    const log = `[${timestamp()}] [${level}] ${message}\n`;

    fs.appendFile(file, log, (err) => {
        if (err) console.error("Logger Error:", err);
    });

}

// ==========================================
// LOGGER
// ==========================================

const logger = {

    info(message) {

        console.log(`ℹ️  ${message}`);

        write(appLog, "INFO", message);

    },

    success(message) {

        console.log(`✅ ${message}`);

        write(appLog, "SUCCESS", message);

    },

    warn(message) {

        console.warn(`⚠️ ${message}`);

        write(appLog, "WARNING", message);

    },

    error(message) {

        console.error(`❌ ${message}`);

        write(errorLog, "ERROR", message);

    },

    debug(message) {

        if (process.env.NODE_ENV !== "production") {

            console.log(`🐛 ${message}`);

        }

        write(appLog, "DEBUG", message);

    }

};

module.exports = logger;
