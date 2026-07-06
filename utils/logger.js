// ========================================
// Halo Marketplace
// utils/logger.js
// Application Logger
// ========================================

const winston = require("winston");
const path = require("path");
const fs = require("fs");

// ========================================
// Log Directory
// ========================================

const logDirectory = path.join(__dirname, "../logs");

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// ========================================
// Custom Format
// ========================================

const logFormat = winston.format.printf(
    ({ level, message, timestamp, stack }) => {

        if (stack) {
            return `${timestamp} [${level}] ${stack}`;
        }

        return `${timestamp} [${level}] ${message}`;
    }
);

// ========================================
// Logger
// ========================================

const logger = winston.createLogger({

    level: process.env.LOG_LEVEL || "info",

    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        winston.format.errors({
            stack: true
        }),
        logFormat
    ),

    transports: [

        new winston.transports.File({
            filename: path.join(logDirectory, "error.log"),
            level: "error"
        }),

        new winston.transports.File({
            filename: path.join(logDirectory, "combined.log")
        })

    ],

    exitOnError: false

});

// ========================================
// Console Logging (Development)
// ========================================

if (process.env.NODE_ENV !== "production") {

    logger.add(

        new winston.transports.Console({

            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({
                    format: "HH:mm:ss"
                }),
                logFormat
            )

        })

    );

}

// ========================================
// HTTP Request Logger
// ========================================

const requestLogger = (req, res, next) => {

    const start = Date.now();

    res.on("finish", () => {

        const duration = Date.now() - start;

        logger.info(
            `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms ${req.ip}`
        );

    });

    next();

};

// ========================================
// Helper Methods
// ========================================

const info = (message) => logger.info(message);

const warn = (message) => logger.warn(message);

const error = (message) => logger.error(message);

const debug = (message) => logger.debug(message);

const verbose = (message) => logger.verbose(message);

// ========================================
// Exports
// ========================================

module.exports = {

    logger,

    requestLogger,

    info,

    warn,

    error,

    debug,

    verbose

};
