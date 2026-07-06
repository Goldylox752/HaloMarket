// ========================================
// Halo Marketplace
// middleware/permissions.js
// Role & Permission Middleware
// ========================================

// ========================================
// Require Authentication
// Assumes auth middleware has already
// attached the logged-in user to req.user
// ========================================

const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    next();
};

// ========================================
// Require Role
// Example:
// router.post("/admin", requireRole("admin"))
// ========================================

const requireRole = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action."
            });
        }

        next();
    };
};

// ========================================
// Admin Only
// ========================================

const adminOnly = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Administrator access required."
        });
    }

    next();
};

// ========================================
// Vendor Only
// ========================================

const vendorOnly = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    if (!["vendor", "admin"].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: "Vendor access required."
        });
    }

    next();
};

// ========================================
// Moderator or Admin
// ========================================

const moderatorOnly = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    if (!["moderator", "admin"].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: "Moderator access required."
        });
    }

    next();
};

// ========================================
// Account Must Be Active
// ========================================

const activeAccount = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    if (req.user.status !== "active") {
        return res.status(403).json({
            success: false,
            message: "Your account has been suspended."
        });
    }

    next();
};

// ========================================
// Resource Owner
// Requires resource.owner to exist
// ========================================

const ownerOrAdmin = (resourceOwnerId) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        if (req.user.role === "admin") {
            return next();
        }

        if (String(resourceOwnerId) !== String(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource."
            });
        }

        next();
    };

};

// ========================================
// Email Verified
// ========================================

const emailVerified = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    if (!req.user.emailVerified) {
        return res.status(403).json({
            success: false,
            message: "Please verify your email before continuing."
        });
    }

    next();
};

// ========================================
// Exports
// ========================================

module.exports = {

    requireAuth,

    requireRole,

    adminOnly,

    vendorOnly,

    moderatorOnly,

    activeAccount,

    ownerOrAdmin,

    emailVerified

};
