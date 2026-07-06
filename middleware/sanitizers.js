// ========================================
// Halo Marketplace
// middleware/sanitizers.js
// Request Sanitization Middleware
// ========================================

const sanitizeHtml = require("sanitize-html");

// ========================================
// Recursively sanitize strings
// ========================================

const clean = (value) => {

    if (typeof value === "string") {

        return sanitizeHtml(value.trim(), {
            allowedTags: [],
            allowedAttributes: {}
        });

    }

    if (Array.isArray(value)) {
        return value.map(clean);
    }

    if (value && typeof value === "object") {

        const cleaned = {};

        for (const key in value) {
            cleaned[key] = clean(value[key]);
        }

        return cleaned;
    }

    return value;

};

// ========================================
// Sanitize Request Body
// ========================================

const sanitizeBody = (req, res, next) => {

    if (req.body) {
        req.body = clean(req.body);
    }

    next();

};

// ========================================
// Sanitize Query Parameters
// ========================================

const sanitizeQuery = (req, res, next) => {

    if (req.query) {
        req.query = clean(req.query);
    }

    next();

};

// ========================================
// Sanitize Route Parameters
// ========================================

const sanitizeParams = (req, res, next) => {

    if (req.params) {
        req.params = clean(req.params);
    }

    next();

};

// ========================================
// Normalize Email
// ========================================

const normalizeEmail = (req, res, next) => {

    if (req.body.email) {
        req.body.email = req.body.email
            .trim()
            .toLowerCase();
    }

    next();

};

// ========================================
// Remove Empty Fields
// ========================================

const removeEmptyFields = (req, res, next) => {

    if (!req.body) return next();

    Object.keys(req.body).forEach(key => {

        const value = req.body[key];

        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {
            delete req.body[key];
        }

    });

    next();

};

// ========================================
// Whitelist Allowed Fields
// ========================================

const allowFields = (...allowedFields) => {

    return (req, res, next) => {

        const filtered = {};

        allowedFields.forEach(field => {

            if (req.body[field] !== undefined) {
                filtered[field] = req.body[field];
            }

        });

        req.body = filtered;

        next();

    };

};

// ========================================
// Convert Numeric Fields
// ========================================

const convertNumbers = (...fields) => {

    return (req, res, next) => {

        fields.forEach(field => {

            if (
                req.body[field] !== undefined &&
                req.body[field] !== ""
            ) {

                const num = Number(req.body[field]);

                if (!isNaN(num)) {
                    req.body[field] = num;
                }

            }

        });

        next();

    };

};

// ========================================
// Convert Boolean Fields
// ========================================

const convertBooleans = (...fields) => {

    return (req, res, next) => {

        fields.forEach(field => {

            if (req.body[field] === "true") {
                req.body[field] = true;
            }

            if (req.body[field] === "false") {
                req.body[field] = false;
            }

        });

        next();

    };

};

// ========================================
// Exports
// ========================================

module.exports = {

    sanitizeBody,

    sanitizeQuery,

    sanitizeParams,

    normalizeEmail,

    removeEmptyFields,

    allowFields,

    convertNumbers,

    convertBooleans

};
