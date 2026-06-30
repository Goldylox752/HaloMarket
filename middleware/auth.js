// ==========================================
// middleware/auth.js
// Halo Marketplace Authentication Middleware
// ==========================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// Verify JWT Token
// ==========================================

exports.protect = async (req, res, next) => {

    try {

        let token;

        // Authorization: Bearer <token>
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // Cookie fallback
        if (!token && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists."
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account has been disabled."
            });
        }

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }

};

// ==========================================
// Admin Only
// ==========================================

exports.adminOnly = (req, res, next) => {

    if (req.user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "Admin access required."
        });

    }

    next();

};

// ==========================================
// Vendor or Admin
// ==========================================

exports.vendorOnly = (req, res, next) => {

    if (
        req.user.role !== "vendor" &&
        req.user.role !== "admin"
    ) {

        return res.status(403).json({
            success: false,
            message: "Vendor access required."
        });

    }

    next();

};
